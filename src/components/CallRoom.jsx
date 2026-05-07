/**
 * CallRoom.jsx — LingoBridge In-Call Screen
 *
 * Fixes applied:
 * - cancelledRef guards every async step (no ghost joins on fast unmount)
 * - Local audio NOT played back to self (prevents echo/feedback)
 * - user-published listener registered BEFORE join (catch early arrivals)
 * - Catch-up loop for users already present after publish
 * - screenTrack cleanup on unmount (no leaked screen streams)
 * - toggleScreen null-checks clientRef before publish/unpublish
 * - All async ops wrapped in try/catch
 * - Loading and error states clearly rendered
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoTile from './VideoTile';
import Controls from './Controls';
import ChatSidebar from './ChatSidebar';
import LanguageSelector from './LanguageSelector';
import './CallRoom.css';

AgoraRTC.setLogLevel(2);

export default function CallRoom({
  appId,
  channel,
  token    = null,
  uid      = 0,
  userName = 'You',
  sessionType = 'video',
  onLeave,
}) {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [screenTrack,     setScreenTrack]     = useState(null);
  const [remoteUsers,     setRemoteUsers]     = useState([]);

  const [micOn,     setMicOn]     = useState(true);
  const [camOn,     setCamOn]     = useState(sessionType === 'video');
  const [screenOn,  setScreenOn]  = useState(false);
  const [chatOpen,  setChatOpen]  = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [language,  setLanguage]  = useState('en');
  const [joined,    setJoined]    = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [elapsed,   setElapsed]   = useState(0);

  const clientRef      = useRef(null);
  const audioTrackRef  = useRef(null);
  const videoTrackRef  = useRef(null);
  const screenTrackRef = useRef(null);
  const joinedRef      = useRef(false);
  const cancelledRef   = useRef(false);

  // ── CALL TIMER ────────────────────────────────────────────────
  useEffect(() => {
    if (!joined) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [joined]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── JOIN ──────────────────────────────────────────────────────
  useEffect(() => {
    clientRef.current    = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    cancelledRef.current = false;
    joinCall();
    return () => { leaveCall(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinCall = async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      // Register BEFORE join — catch users already in channel
      client.on('user-published', async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') user.audioTrack?.play();
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === user.uid);
            if (exists) return prev.map((u) => (u.uid === user.uid ? user : u));
            return [...prev, user];
          });
        } catch (e) {
          console.error('[CallRoom] subscribe error:', e);
        }
      });

      client.on('user-unpublished', (user) => {
        setRemoteUsers((prev) => prev.map((u) => (u.uid === user.uid ? { ...u } : u)));
      });

      client.on('user-left', (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      await client.join(appId, channel, token, uid);

      if (cancelledRef.current) {
        try { await client.leave(); } catch (_) {}
        return;
      }

      joinedRef.current = true;

      // Create microphone track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      if (cancelledRef.current) { audioTrack.stop(); audioTrack.close(); return; }
      audioTrackRef.current = audioTrack;
      setLocalAudioTrack(audioTrack);
      // NOTE: do NOT call audioTrack.play() here — would cause echo/feedback

      const tracksToPublish = [audioTrack];

      // Create camera track (video sessions only)
      if (sessionType === 'video') {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        if (cancelledRef.current) {
          audioTrack.stop(); audioTrack.close();
          videoTrack.stop(); videoTrack.close();
          return;
        }
        videoTrackRef.current = videoTrack;
        setLocalVideoTrack(videoTrack);
        tracksToPublish.push(videoTrack);
      }

      if (cancelledRef.current) return;

      await client.publish(tracksToPublish);

      // Catch users who were already present
      if (!cancelledRef.current && client.remoteUsers.length > 0) {
        await Promise.allSettled(
          client.remoteUsers.flatMap((user) => {
            const subs = [];
            if (user.hasAudio) subs.push(
              client.subscribe(user, 'audio').then(() => user.audioTrack?.play()).catch(() => {})
            );
            if (user.hasVideo) subs.push(client.subscribe(user, 'video').catch(() => {}));
            return subs;
          })
        );
        setRemoteUsers([...client.remoteUsers]);
      }

      if (!cancelledRef.current) setJoined(true);

    } catch (err) {
      if (cancelledRef.current) return;
      console.error('[CallRoom] Join failed:', err);
      setJoinError(err?.message || 'Failed to join call');
    }
  };

  // ── LEAVE ─────────────────────────────────────────────────────
  const leaveCall = async (notifyParent = true) => {
    cancelledRef.current = true;
    const client = clientRef.current;
    clientRef.current = null;

    audioTrackRef.current?.stop();
    audioTrackRef.current?.close();
    audioTrackRef.current = null;

    videoTrackRef.current?.stop();
    videoTrackRef.current?.close();
    videoTrackRef.current = null;

    screenTrackRef.current?.stop();
    screenTrackRef.current?.close();
    screenTrackRef.current = null;

    if (client) {
      client.removeAllListeners();
      try { await client.leave(); } catch (_) {}
    }

    joinedRef.current = false;
    if (notifyParent) onLeave?.();
  };

  const handleLeaveBtn = useCallback(() => leaveCall(true), []);

  // ── MIC / CAM TOGGLE ─────────────────────────────────────────
  const toggleMic = useCallback(async () => {
    if (!audioTrackRef.current) return;
    try {
      await audioTrackRef.current.setEnabled(!micOn);
      setMicOn((v) => !v);
    } catch (e) { console.warn('[CallRoom] toggleMic:', e); }
  }, [micOn]);

  const toggleCam = useCallback(async () => {
    if (!videoTrackRef.current) return;
    try {
      await videoTrackRef.current.setEnabled(!camOn);
      setCamOn((v) => !v);
    } catch (e) { console.warn('[CallRoom] toggleCam:', e); }
  }, [camOn]);

  // ── SCREEN SHARE ──────────────────────────────────────────────
  const toggleScreen = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    if (!screenOn) {
      try {
        const track = await AgoraRTC.createScreenVideoTrack({}, 'disable');
        if (videoTrackRef.current) await client.unpublish([videoTrackRef.current]).catch(() => {});
        await client.publish([track]);
        screenTrackRef.current = track;
        setScreenTrack(track);
        setScreenOn(true);
        // Auto-stop when user clicks browser "Stop sharing"
        track.on('track-ended', () => toggleScreen());
      } catch (e) {
        console.error('[CallRoom] Screen share error:', e);
      }
    } else {
      if (screenTrackRef.current) {
        await client.unpublish([screenTrackRef.current]).catch(() => {});
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
        screenTrackRef.current = null;
        setScreenTrack(null);
      }
      if (videoTrackRef.current) {
        await client.publish([videoTrackRef.current]).catch(() => {});
      }
      setScreenOn(false);
    }
  }, [screenOn]);

  // ── CHAT ──────────────────────────────────────────────────────
  const sendMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      {
        author:  userName,
        text,
        time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLocal: true,
      },
    ]);
  }, [userName]);

  const activeVideoTrack = screenOn ? screenTrack : localVideoTrack;
  const gridCount        = Math.min(remoteUsers.length + 1, 4);

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="callroom">
      {/* ── HEADER ── */}
      <header className="callroom__header">
        <div className="callroom__brand">
          <span className="callroom__logo">LingoBridge</span>
          <span className="callroom__channel"># {channel}</span>
          <span className={`callroom__session-badge callroom__session-badge--${sessionType}`}>
            {sessionType === 'video' ? '📹 Video' : '🎙 Audio'}
          </span>
        </div>

        {joined && (
          <div className="callroom__timer">{formatTime(elapsed)}</div>
        )}

        <LanguageSelector value={language} onChange={setLanguage} />

        <button
          className={`callroom__chat-toggle ${chatOpen ? 'active' : ''}`}
          onClick={() => setChatOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
          {messages.length > 0 && (
            <span className="callroom__badge">{messages.length}</span>
          )}
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="callroom__body">
        <main className="callroom__stage">

          {/* Error */}
          {joinError && (
            <div className="callroom__error">
              <div className="callroom__error-icon">⚠️</div>
              <div className="callroom__error-title">Failed to join call</div>
              <div className="callroom__error-msg">{joinError}</div>
              <button className="callroom__error-btn" onClick={handleLeaveBtn}>
                ← Back to dashboard
              </button>
            </div>
          )}

          {/* Connecting */}
          {!joined && !joinError && (
            <div className="callroom__connecting">
              <div className="callroom__spinner" />
              <p>Joining {channel}…</p>
            </div>
          )}

          {/* Video grid */}
          {joined && !joinError && (
            <div className={`callroom__grid callroom__grid--${gridCount}`}>
              <VideoTile
                track={activeVideoTrack}
                label={screenOn ? `${userName} (screen)` : userName}
                isLocal
              />
              {remoteUsers.map((user) => (
                <VideoTile
                  key={user.uid}
                  track={user.videoTrack}
                  label={`User ${user.uid}`}
                />
              ))}
            </div>
          )}
        </main>

        <ChatSidebar open={chatOpen} messages={messages} onSend={sendMessage} />
      </div>

      {/* ── FOOTER ── */}
      <footer className="callroom__footer">
        <Controls
          micOn={micOn}
          camOn={camOn}
          screenOn={screenOn}
          sessionType={sessionType}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onToggleScreen={toggleScreen}
          onLeave={handleLeaveBtn}
        />
      </footer>
    </div>
  );
}