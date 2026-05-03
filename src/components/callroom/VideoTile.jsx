import { useEffect, useRef } from 'react';

/**
 * VideoTile — renders an Agora video track into a div.
 *
 * Fixes:
 * - Local tile uses mirror:true for natural selfie view
 * - fit:'cover' so there are no black bars
 * - On track change, old track is stopped before new one plays
 *   (prevents ghost streams when switching between camera/screen)
 * - Null-safe: renders avatar placeholder when track is absent
 */
export default function VideoTile({ track, label, isLocal = false }) {
  const containerRef = useRef(null);
  const prevTrackRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Stop the previous track's render into this container
    if (prevTrackRef.current && prevTrackRef.current !== track) {
      try { prevTrackRef.current.stop(); } catch (_) {}
    }

    if (track) {
      try {
        track.play(el, { fit: 'cover', mirror: isLocal });
      } catch (e) {
        console.error('[VideoTile] play error:', e);
      }
    }

    prevTrackRef.current = track;

    return () => {
      if (track) {
        try { track.stop(); } catch (_) {}
      }
    };
  }, [track, isLocal]);

  return (
    <div className={`video-tile ${isLocal ? 'video-tile--local' : 'video-tile--remote'}`}>
      <div className="video-tile__screen" ref={containerRef}>
        {!track && (
          <div className="video-tile__placeholder">
            <span className="video-tile__avatar">
              {label?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        )}
      </div>
      <span className="video-tile__label">{label}</span>
    </div>
  );
}