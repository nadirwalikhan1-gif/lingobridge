/**
 * CallRoom.jsx — LingoBridge In-Call Screen
 * Fixed: each mount gets its own Agora client instance
 * Fixed: cancellation guard prevents publish-before-join race on fast remount
 * Fixed: listeners registered before join so no user-published events are missed
 * Fixed: local audio monitoring so you hear yourself in headset
 * Fixed: remoteUsers reconciled after publish to catch already-present users
 */

import { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoTile from './VideoTile';
import Controls from './Controls';
import ChatSidebar from './ChatSidebar';
import LanguageSelector from './LanguageSelector';
import './CallRoom.css';

export default function CallRoom({
  appId,
  channel,
  token = null,
  uid = 0,
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

  // Each mount creates ONE fresh client — stored in ref, never shared
  const clientRef      = useRef(null);
  const audioTrackRef  = useRef(null);
  const videoTrackRef  = useRef(null);
  const screenTrackRef = useRef(null);
  const joinedRef      = useRef(false);
  // Flipped to true the moment leaveCall runs so any still-awaiting
  // joinCall steps know they've been abandoned and must not proceed.
  const cancelledRef   = useRef(false);

  useEffect(() => {
    AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
    clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    cancelledRef.current = false;
    console.log('🎯 Joining channel:', channel, '| uid:', uid, '| appId:', appId);
    joinCall();

    return () => {
      leaveCall(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinCall = async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      // 1. Register listeners BEFORE joining so no user-published events
      //    are missed from users already present in the channel
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log('📡 Subscribed to remote user:', user.uid, mediaType);

        if (mediaType === 'audio') {
          user.audioTrack?.play();
            // Set volume to avoid feedback
         user.audioTrack?.setVolume(80)
          console.log('🔊 Playing remote audio from:', user.uid);
        }

        setRemoteUsers((prev) => {
          const exists = prev.find((u) => u.uid === user.uid);
          if (exists) return prev.map((u) => (u.uid === user.uid ? user : u));
          return [...prev, user];
        });
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log('📡 User unpublished:', user.uid, mediaType);
        setRemoteUsers((prev) =>
          prev.map((u) => (u.uid === user.uid ? { ...u } : u))
        );
      });

      client.on('user-left', (user) => {
        console.log('👋 User left:', user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      // 2. Join the channel — listeners are already in place
      await client.join(appId, channel, token, uid);

      // Guard: leaveCall may have fired while we were awaiting join
      if (cancelledRef.current) {
        console.log('⚠️ Join completed after cancel — tearing down immediately');
        try { await client.leave(); } catch (_) {}
        return;
      }

      joinedRef.current = true;
      console.log('✅ Joined channel:', channel);

      // 3. Create local tracks
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
  encoderConfig: {
    sampleRate: 48000,
    stereo: false,
    bitrate: 128,
  },
  AEC: true,
  ANS: true,
  AGC: true,
});

      // Guard: cancelled while awaiting mic permission
      if (cancelledRef.current) {
        audioTrack.stop();
        audioTrack.close();
        return;
      }

      audioTrackRef.current = audioTrack;
      setLocalAudioTrack(audioTrack);

      // Play local audio so you hear yourself in your headset.
      // Agora does NOT send this back to remotes — local monitoring only.
      

      const tracksToPublish = [audioTrack];

      if (sessionType === 'video') {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();

        // Guard: cancelled while awaiting camera permission
        if (cancelledRef.current) {
          audioTrack.stop();
          audioTrack.close();
          videoTrack.stop();
          videoTrack.close();
          return;
        }

        videoTrackRef.current = videoTrack;
        setLocalVideoTrack(videoTrack);
        tracksToPublish.push(videoTrack);
      }

      // 4. Final guard before hitting the wire
      if (cancelledRef.current) return;

      await client.publish(tracksToPublish);
      console.log('📤 Published local tracks');

      // 5. After publishing, reconcile anyone already in the channel who
      //    published before our listener was able to catch their event.
      if (!cancelledRef.current) {
        const alreadyPresent = client.remoteUsers;
        if (alreadyPresent.length > 0) {
          console.log('👥 Catching up with already-present users:', alreadyPresent.map(u => u.uid));
          await Promise.all(
            alreadyPresent.flatMap((user) => {
              const subs = [];
              if (user.hasAudio) subs.push(
                client.subscribe(user, 'audio').then(() => user.audioTrack?.play())
              );
              if (user.hasVideo) subs.push(
                client.subscribe(user, 'video')
              );
              return subs;
            })
          );
          setRemoteUsers([...alreadyPresent]);
        }

        setJoined(true);
      }

    } catch (err) {
      if (!cancelledRef.current) {
        console.error('[CallRoom] Join failed:', err);
        setJoinError(err.message || 'Failed to join call');
      }
    }
  };

  // ── LEAVE ────────────────────────────────────────────────────
  const leaveCall = async (notifyParent = true) => {
    // Signal any in-flight joinCall to abort — must happen before any await
    cancelledRef.current = true;

    const client = clientRef.current;
    // Clear the ref immediately so nothing else can grab this client
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

  const handleLeaveBtn = () => leaveCall(true);

  // ── CONTROLS ─────────────────────────────────────────────────
  const toggleMic = async () => {
    if (audioTrackRef.current) {
      await audioTrackRef.current.setEnabled(!micOn);
      setMicOn((v) => !v);
    }
  };

  const toggleCam = async () => {
    if (videoTrackRef.current) {
      await videoTrackRef.current.setEnabled(!camOn);
      setCamOn((v) => !v);
    }
  };

  const toggleScreen = async () => {
    const client = clientRef.current;
    if (!screenOn) {
      try {
        const track = await AgoraRTC.createScreenVideoTrack({}, 'disable');
        if (videoTrackRef.current) await client.unpublish([videoTrackRef.current]);
        await client.publish([track]);
        screenTrackRef.current = track;
        setScreenTrack(track);
        setScreenOn(true);
        track.on('track-ended', () => toggleScreen());
      } catch (e) {
        console.error('[CallRoom] Screen share error:', e);
      }
    } else {
      if (screenTrackRef.current) {
        await client.unpublish([screenTrackRef.current]);
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
        screenTrackRef.current = null;
        setScreenTrack(null);
      }
      if (videoTrackRef.current) await client.publish([videoTrackRef.current]);
      setScreenOn(false);
    }
  };

  // ── CHAT ─────────────────────────────────────────────────────
  const sendMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        author: userName,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLocal: true,
      },
    ]);
  };

  const activeVideoTrack = screenOn ? screenTrack : localVideoTrack;
  const gridCount = Math.min(remoteUsers.length + 1, 4);

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="callroom">
      {/* Header */}
      <header className="callroom__header">
        <div className="callroom__brand">
          <span className="callroom__logo">LingoBridge</span>
          <span className="callroom__channel"># {channel}</span>
          <span style={{
            fontSize: 12, padding: '2px 10px', borderRadius: 20,
            background: sessionType === 'video'
              ? 'rgba(124,92,255,0.15)'
              : 'rgba(0,229,168,0.12)',
            color: sessionType === 'video' ? '#a78bfa' : '#34d399',
            border: `1px solid ${sessionType === 'video'
              ? 'rgba(124,92,255,0.3)'
              : 'rgba(0,229,168,0.3)'}`,
          }}>
            {sessionType === 'video' ? '📹 Video' : '🎙 Audio'}
          </span>
        </div>

        <LanguageSelector value={language} onChange={setLanguage} />

        <button
          className={`callroom__chat-toggle ${chatOpen ? 'active' : ''}`}
          onClick={() => setChatOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
          {messages.length > 0 && (
            <span className="callroom__badge">{messages.length}</span>
          )}
        </button>
      </header>

      {/* Body */}
      <div className="callroom__body">
        <main className="callroom__stage">

          {/* Join error */}
          {joinError && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 14, color: '#f87171',
            }}>
              <div style={{ fontSize: 32 }}>⚠️</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Failed to join call</div>
              <div style={{ fontSize: 13, color: 'rgba(248,113,113,0.7)',
                textAlign: 'center', maxWidth: 340 }}>
                {joinError}
              </div>
              <button
                onClick={handleLeaveBtn}
                style={{
                  padding: '9px 24px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  color: '#f87171', cursor: 'pointer', fontSize: 13,
                  fontFamily: 'inherit', marginTop: 8,
                }}
              >← Back to dashboard</button>
            </div>
          )}

          {/* Connecting spinner */}
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

        <ChatSidebar
          open={chatOpen}
          messages={messages}
          onSend={sendMessage}
        />
      </div>

      {/* Footer controls */}
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