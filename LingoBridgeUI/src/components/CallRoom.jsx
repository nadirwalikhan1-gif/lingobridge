import { useEffect, useMemo, useRef, useState } from 'react';
import { useAgora } from '../hooks/useAgora';

function formatDuration(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function VideoPane({ track, label, muted = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!track || !ref.current) return undefined;

    track.play(ref.current, { fit: 'cover', mirror: muted });
    return () => {
      track.stop();
    };
  }, [muted, track]);

  return (
    <div className={`agora-video-pane ${className}`}>
      <div ref={ref} className="agora-video-slot" />
      {!track && (
        <div className="agora-video-empty">
          <span>{label?.charAt(0)?.toUpperCase() || 'U'}</span>
        </div>
      )}
      <div className="agora-video-label">{label}</div>
    </div>
  );
}

export default function CallRoom({
  appId,
  channel,
  token = null,
  uid,
  userName = 'You',
  sessionType = 'video',
  onLeave,
}) {
  const [elapsed, setElapsed] = useState(0);
  const isVideoCall = sessionType !== 'audio';
  const {
    localVideoTrack,
    remoteUsers,
    status,
    error,
    micOn,
    cameraOn,
    toggleMic,
    toggleCamera,
    leave,
  } = useAgora({
    appId,
    channel,
    token,
    uid,
    video: isVideoCall,
    onLeave,
  });

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const primaryRemote = useMemo(
    () => remoteUsers.find((user) => user.videoTrack) || remoteUsers[0] || null,
    [remoteUsers]
  );

  const callStatus = error
    ? 'Call error'
    : status === 'connected'
      ? remoteUsers.length > 0
        ? 'Connected'
        : 'Waiting for participant'
      : status === 'left'
        ? 'Call ended'
        : 'Connecting';

  return (
    <div className="agora-room">
      <style>{styles}</style>

      <VideoPane
        track={primaryRemote?.videoTrack}
        label={primaryRemote ? `User ${primaryRemote.uid}` : 'Waiting for remote video'}
        className="agora-remote-video"
      />

      <div className="agora-shade" />

      <header className="agora-topbar">
        <div>
          <div className="agora-eyebrow">LingoBridge Call</div>
          <div className="agora-status">
            <span className={`agora-status-dot ${status}`} />
            {callStatus}
          </div>
        </div>
        <div className="agora-timer">{formatDuration(elapsed)}</div>
      </header>

      <VideoPane
        track={cameraOn ? localVideoTrack : null}
        label={cameraOn ? userName : 'Camera off'}
        muted
        className="agora-local-video"
      />

      {error && (
        <div className="agora-error">
          <strong>Unable to join call</strong>
          <span>{error}</span>
        </div>
      )}

      <footer className="agora-controls" aria-label="Call controls">
        <button
          type="button"
          className={`agora-control ${micOn ? '' : 'is-off'}`}
          onClick={toggleMic}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? 'Mic' : 'Muted'}
        </button>
        <button
          type="button"
          className={`agora-control ${cameraOn ? '' : 'is-off'}`}
          onClick={toggleCamera}
          disabled={!isVideoCall}
          title={cameraOn ? 'Turn camera off' : 'Turn camera on'}
        >
          {cameraOn ? 'Camera' : 'Camera off'}
        </button>
        <button
          type="button"
          className="agora-control agora-end"
          onClick={leave}
          title="End call"
        >
          End
        </button>
      </footer>
    </div>
  );
}

const styles = `
  .agora-room {
    position: fixed;
    inset: 0;
    z-index: 10000;
    overflow: hidden;
    background: #05070d;
    color: #fff;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .agora-video-pane {
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at center, #182033 0%, #090d16 58%, #05070d 100%);
  }

  .agora-video-slot,
  .agora-video-slot > div,
  .agora-video-slot video {
    width: 100%;
    height: 100%;
  }

  .agora-video-slot video {
    object-fit: cover;
  }

  .agora-remote-video {
    position: absolute;
    inset: 0;
  }

  .agora-local-video {
    position: absolute;
    right: clamp(16px, 3vw, 34px);
    bottom: clamp(96px, 14vh, 132px);
    width: min(28vw, 320px);
    min-width: 180px;
    aspect-ratio: 16 / 10;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
    z-index: 3;
  }

  .agora-shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.56) 0%, rgba(0,0,0,0.08) 34%, rgba(0,0,0,0.64) 100%),
      linear-gradient(90deg, rgba(0,0,0,0.28), transparent 40%, rgba(0,0,0,0.18));
  }

  .agora-topbar,
  .agora-controls,
  .agora-error {
    background: rgba(14, 20, 34, 0.48);
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.26);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .agora-topbar {
    position: absolute;
    top: clamp(14px, 3vw, 28px);
    left: clamp(14px, 3vw, 28px);
    right: clamp(14px, 3vw, 28px);
    z-index: 4;
    min-height: 72px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
  }

  .agora-eyebrow {
    font-size: 11px;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.58);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 800;
    margin-bottom: 5px;
  }

  .agora-status {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-size: 16px;
    font-weight: 800;
  }

  .agora-status-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #f59e0b;
    box-shadow: 0 0 18px rgba(245, 158, 11, 0.9);
  }

  .agora-status-dot.connected {
    background: #22c55e;
    box-shadow: 0 0 18px rgba(34, 197, 94, 0.9);
  }

  .agora-status-dot.error {
    background: #ef4444;
    box-shadow: 0 0 18px rgba(239, 68, 68, 0.9);
  }

  .agora-timer {
    min-width: 82px;
    padding: 9px 13px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.09);
    color: rgba(255, 255, 255, 0.92);
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 900;
    font-size: 18px;
  }

  .agora-video-empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .agora-video-empty span {
    width: 92px;
    height: 92px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.16);
    font-size: 34px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.72);
  }

  .agora-video-label {
    position: absolute;
    left: 12px;
    bottom: 10px;
    z-index: 2;
    max-width: calc(100% - 24px);
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.86);
    font-size: 12px;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .agora-error {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 5;
    transform: translate(-50%, -50%);
    width: min(420px, calc(100vw - 32px));
    border-radius: 18px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    color: #fecaca;
    text-align: center;
  }

  .agora-error strong {
    color: #fff;
    font-size: 16px;
  }

  .agora-error span {
    color: rgba(254, 202, 202, 0.86);
    font-size: 13px;
    line-height: 1.5;
  }

  .agora-controls {
    position: absolute;
    left: 50%;
    bottom: clamp(18px, 4vw, 34px);
    z-index: 4;
    transform: translateX(-50%);
    min-height: 72px;
    border-radius: 999px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .agora-control {
    min-width: 96px;
    height: 50px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font: inherit;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
  }

  .agora-control:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.18);
  }

  .agora-control:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .agora-control.is-off {
    background: rgba(245, 158, 11, 0.18);
    border-color: rgba(245, 158, 11, 0.4);
    color: #fde68a;
  }

  .agora-end {
    background: #ef4444;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 12px 34px rgba(239, 68, 68, 0.36);
  }

  .agora-end:hover {
    background: #dc2626 !important;
  }

  @media (max-width: 700px) {
    .agora-topbar {
      min-height: 64px;
      border-radius: 14px;
      padding: 12px 14px;
    }

    .agora-status {
      font-size: 14px;
    }

    .agora-timer {
      min-width: 70px;
      font-size: 15px;
    }

    .agora-local-video {
      right: 14px;
      bottom: 104px;
      width: 42vw;
      min-width: 142px;
      border-radius: 14px;
    }

    .agora-controls {
      width: calc(100vw - 24px);
      border-radius: 20px;
      gap: 8px;
    }

    .agora-control {
      flex: 1;
      min-width: 0;
      height: 48px;
      font-size: 12px;
    }
  }
`;
