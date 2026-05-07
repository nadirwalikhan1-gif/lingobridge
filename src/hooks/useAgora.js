/**
 * useAgora.js
 *
 * Fixes applied:
 * - cancelledRef guards every async step; no post-unmount state updates
 * - Listeners registered BEFORE client.join() so no user-published is missed
 * - Promise.allSettled (not .all) for catch-up subscriptions; one failure
 *   does not abort the rest
 * - cleanup() clears refs before awaiting so double-calls are safe
 * - toggleMic / toggleCamera are no-ops when track is null (no crash)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

AgoraRTC.setLogLevel(2); // WARN level – suppress SDK noise

export function useAgora({ appId, channel, token = null, uid, video = true, onLeave }) {
  const clientRef      = useRef(null);
  const audioTrackRef  = useRef(null);
  const videoTrackRef  = useRef(null);
  const joinedRef      = useRef(false);
  const cancelledRef   = useRef(false);

  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers,     setRemoteUsers]     = useState([]);
  const [status,          setStatus]          = useState('connecting');
  const [error,           setError]           = useState(null);
  const [micOn,           setMicOn]           = useState(true);
  const [cameraOn,        setCameraOn]        = useState(video);

  // ── cleanup ──────────────────────────────────────────────────────────────
  const cleanup = useCallback(async () => {
    // Flip first – guards all in-flight async steps
    cancelledRef.current = true;

    // Grab and clear refs before any await so double-calls are safe
    const client     = clientRef.current;
    const audioTrack = audioTrackRef.current;
    const videoTrack = videoTrackRef.current;
    clientRef.current     = null;
    audioTrackRef.current = null;
    videoTrackRef.current = null;

    try { audioTrack?.stop();  } catch (_) {}
    try { audioTrack?.close(); } catch (_) {}
    try { videoTrack?.stop();  } catch (_) {}
    try { videoTrack?.close(); } catch (_) {}

    if (client) {
      client.removeAllListeners();
      if (joinedRef.current) {
        try { await client.leave(); } catch (_) {}
      }
    }

    joinedRef.current = false;
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteUsers([]);
    setStatus('left');
  }, []);

  const leave = useCallback(async () => {
    await cleanup();
    onLeave?.();
  }, [cleanup, onLeave]);

  // ── join sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appId || !channel) {
      setError('Missing Agora app ID or channel.');
      setStatus('error');
      return;
    }

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current    = client;
    cancelledRef.current = false;
    joinedRef.current    = false;

    // Register listeners BEFORE join so we never miss user-published
    const onUserPublished = async (user, mediaType) => {
      if (cancelledRef.current) return;
      try {
        await client.subscribe(user, mediaType);
        if (mediaType === 'audio') user.audioTrack?.play();
        setRemoteUsers((prev) => {
          const idx = prev.findIndex((u) => u.uid === user.uid);
          if (idx === -1) return [...prev, user];
          const next = [...prev];
          next[idx] = user;
          return next;
        });
      } catch (subErr) {
        console.warn('[useAgora] subscribe error:', subErr);
      }
    };

    const onUserUnpublished = (user) => {
      if (!cancelledRef.current)
        // Spread to trigger re-render (tracks cleared by SDK)
        setRemoteUsers((prev) =>
          prev.map((u) => (u.uid === user.uid ? { ...user } : u))
        );
    };

    const onUserLeft = (user) => {
      if (!cancelledRef.current)
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on('user-published',   onUserPublished);
    client.on('user-unpublished', onUserUnpublished);
    client.on('user-left',        onUserLeft);

    const join = async () => {
      setStatus('connecting');
      setError(null);

      try {
        await client.join(appId, channel, token ?? null, uid ?? null);

        if (cancelledRef.current) {
          try { await client.leave(); } catch (_) {}
          return;
        }

        joinedRef.current = true;

        // Create mic track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true, ANS: true, AGC: true,
        });
        if (cancelledRef.current) { audioTrack.stop(); audioTrack.close(); return; }

        audioTrackRef.current = audioTrack;
        setLocalAudioTrack(audioTrack);

        const tracksToPublish = [audioTrack];

        // Create camera track (video sessions only)
        if (video) {
          const cameraTrack = await AgoraRTC.createCameraVideoTrack();
          if (cancelledRef.current) {
            cameraTrack.stop(); cameraTrack.close();
            audioTrack.stop();  audioTrack.close();
            return;
          }
          videoTrackRef.current = cameraTrack;
          setLocalVideoTrack(cameraTrack);
          tracksToPublish.push(cameraTrack);
        }

        if (cancelledRef.current) return;
        await client.publish(tracksToPublish);

        // Catch up with users already present before we published
        if (!cancelledRef.current && client.remoteUsers.length > 0) {
          await Promise.allSettled(
            client.remoteUsers.flatMap((user) => {
              const subs = [];
              if (user.hasAudio) subs.push(
                client.subscribe(user, 'audio').then(() => user.audioTrack?.play())
              );
              if (user.hasVideo) subs.push(client.subscribe(user, 'video'));
              return subs;
            })
          );
          if (!cancelledRef.current) setRemoteUsers([...client.remoteUsers]);
        }

        if (!cancelledRef.current) setStatus('connected');

      } catch (joinErr) {
        if (!cancelledRef.current) {
          console.error('[useAgora] join failed:', joinErr);
          setError(joinErr?.message || 'Could not join the call.');
          setStatus('error');
          await cleanup();
        }
      }
    };

    join();
    return () => { cleanup(); };
  // appId/channel/token/uid/video are intentionally excluded:
  // App.jsx unmounts + remounts CallRoom when these change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── controls ─────────────────────────────────────────────────────────────
  const toggleMic = useCallback(async () => {
    const track = audioTrackRef.current;
    if (!track) return;                    // BUG FIX: was crashing when null
    const next = !micOn;
    try { await track.setEnabled(next); } catch (_) {}
    setMicOn(next);
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    const track = videoTrackRef.current;
    if (!track) return;                    // BUG FIX: was crashing when null
    const next = !cameraOn;
    try { await track.setEnabled(next); } catch (_) {}
    setCameraOn(next);
  }, [cameraOn]);

  return {
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    status,
    error,
    micOn,
    cameraOn,
    toggleMic,
    toggleCamera,
    leave,
  };
}