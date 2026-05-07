import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export function useAgora({
  appId,
  channel,
  token = null,
  uid,
  video = true,
  onLeave,
}) {
  const clientRef = useRef(null);
  const audioTrackRef = useRef(null);
  const videoTrackRef = useRef(null);
  const joinedRef = useRef(false);
  const leavingRef = useRef(false);

  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(video);

  const refreshRemoteUsers = useCallback((client) => {
    setRemoteUsers([...client.remoteUsers]);
  }, []);

  const cleanup = useCallback(async () => {
    leavingRef.current = true;

    const client = clientRef.current;
    clientRef.current = null;

    const audioTrack = audioTrackRef.current;
    audioTrackRef.current = null;
    setLocalAudioTrack(null);
    if (audioTrack) {
      audioTrack.stop();
      audioTrack.close();
    }

    const videoTrack = videoTrackRef.current;
    videoTrackRef.current = null;
    setLocalVideoTrack(null);
    if (videoTrack) {
      videoTrack.stop();
      videoTrack.close();
    }

    if (client) {
      client.removeAllListeners();
      if (joinedRef.current) {
        try {
          await client.leave();
        } catch (leaveError) {
          console.warn('[Agora] Leave failed:', leaveError);
        }
      }
    }

    joinedRef.current = false;
    setRemoteUsers([]);
    setStatus('left');
  }, []);

  const leave = useCallback(async () => {
    await cleanup();
    onLeave?.();
  }, [cleanup, onLeave]);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;
    leavingRef.current = false;
    joinedRef.current = false;

    const handleUserPublished = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
        refreshRemoteUsers(client);
      } catch (subscribeError) {
        console.error('[Agora] Subscribe failed:', subscribeError);
      }
    };

    const handleUserUnpublished = () => {
      refreshRemoteUsers(client);
    };

    const handleUserLeft = () => {
      refreshRemoteUsers(client);
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    const join = async () => {
      setStatus('connecting');
      setError(null);
      setRemoteUsers([]);
      setMicOn(true);
      setCameraOn(video);

      if (!appId || !channel) {
        setStatus('error');
        setError('Missing Agora app ID or channel.');
        return;
      }

      try {
        await client.join(appId, channel, token ?? null, uid ?? null);
        if (leavingRef.current) return;

        joinedRef.current = true;

        const tracks = [];
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        if (leavingRef.current) {
          audioTrack.close();
          return;
        }

        audioTrackRef.current = audioTrack;
        setLocalAudioTrack(audioTrack);
        tracks.push(audioTrack);

        if (video) {
          const cameraTrack = await AgoraRTC.createCameraVideoTrack();
          if (leavingRef.current) {
            cameraTrack.close();
            return;
          }

          videoTrackRef.current = cameraTrack;
          setLocalVideoTrack(cameraTrack);
          tracks.push(cameraTrack);
        }

        await client.publish(tracks);
        if (leavingRef.current) return;

        await Promise.all(
          client.remoteUsers.flatMap((user) => {
            const subscriptions = [];
            if (user.hasAudio) {
              subscriptions.push(
                client.subscribe(user, 'audio').then(() => user.audioTrack?.play())
              );
            }
            if (user.hasVideo) {
              subscriptions.push(client.subscribe(user, 'video'));
            }
            return subscriptions;
          })
        );

        refreshRemoteUsers(client);
        setStatus('connected');
      } catch (joinError) {
        if (leavingRef.current) return;
        console.error('[Agora] Join failed:', joinError);
        setError(joinError?.message || 'Could not join the call.');
        setStatus('error');
        await cleanup();
      }
    };

    join();

    return () => {
      cleanup();
    };
  }, [appId, channel, cleanup, refreshRemoteUsers, token, uid, video]);

  const toggleMic = useCallback(async () => {
    const next = !micOn;
    if (audioTrackRef.current) {
      await audioTrackRef.current.setEnabled(next);
    }
    setMicOn(next);
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    const next = !cameraOn;
    if (videoTrackRef.current) {
      await videoTrackRef.current.setEnabled(next);
    }
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
