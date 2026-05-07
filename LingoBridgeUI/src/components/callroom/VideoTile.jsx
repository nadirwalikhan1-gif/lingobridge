import { useEffect, useRef } from "react";

export default function VideoTile({ track, label, isLocal = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (track && ref.current) {
      track.play(ref.current);
    }
    return () => {
      if (track) track.stop();
    };
  }, [track]);

  return (
    <div className={`video-tile ${isLocal ? "video-tile--local" : "video-tile--remote"}`}>
      <div className="video-tile__screen" ref={ref}>
        {!track && (
          <div className="video-tile__placeholder">
            <span className="video-tile__avatar">{label?.[0] ?? "?"}</span>
          </div>
        )}
      </div>
      <span className="video-tile__label">{label}</span>
    </div>
  );
}