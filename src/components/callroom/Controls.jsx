import { memo } from 'react';

/**
 * Controls — call room footer buttons.
 * Wrapped in memo: re-renders only when props change.
 */
const Controls = memo(function Controls({
  micOn,
  camOn,
  screenOn,
  sessionType = 'video',
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onLeave,
}) {
  return (
    <div className="controls">
      {/* Mic */}
      <button
        className={`controls__btn ${micOn ? '' : 'controls__btn--off'}`}
        onClick={onToggleMic}
        title={micOn ? 'Mute mic' : 'Unmute mic'}
      >
        {micOn ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
        <span>{micOn ? 'Mute' : 'Unmute'}</span>
      </button>

      {/* Camera — video sessions only */}
      {sessionType === 'video' && (
        <button
          className={`controls__btn ${camOn ? '' : 'controls__btn--off'}`}
          onClick={onToggleCam}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          )}
          <span>{camOn ? 'Cam off' : 'Cam on'}</span>
        </button>
      )}

      {/* Screen share — video sessions only */}
      {sessionType === 'video' && (
        <button
          className={`controls__btn ${screenOn ? 'controls__btn--active' : ''}`}
          onClick={onToggleScreen}
          title={screenOn ? 'Stop sharing' : 'Share screen'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>{screenOn ? 'Stop share' : 'Share'}</span>
        </button>
      )}

      {/* Leave */}
      <button
        className="controls__btn controls__btn--leave"
        onClick={onLeave}
        title="Leave call"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.43 9.6a19.79 19.79 0 0 1-3.07-8.68A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.32 9.9"/>
          <line x1="23" y1="1" x2="1" y2="23"/>
        </svg>
        <span>Leave</span>
      </button>
    </div>
  );
});

export default Controls;