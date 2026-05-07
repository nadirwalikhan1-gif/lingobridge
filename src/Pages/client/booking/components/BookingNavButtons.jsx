const C = {
  accent: '#7C5CFF', accentGlow: 'rgba(124,92,255,0.5)',
  bg3: '#1A2235', border: 'rgba(255,255,255,0.06)', t2: '#A0AEC0',
};

export default function BookingNavButtons({ step, onBack, onNext, onConnect, onSchedule, mode }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8 }}>
      {step > 1 && (
        <button onClick={onBack} style={{
          padding: '13px 24px', borderRadius: 10,
          background: C.bg3, color: C.t2,
          border: `1px solid ${C.border}`,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          fontSize: 13, fontWeight: 600,
        }}>← Back</button>
      )}

      {step < 5 ? (
        <button onClick={onNext} style={{
          flex: 1, padding: '13px', borderRadius: 10,
          background: `linear-gradient(135deg, ${C.accent}, #6366f1)`,
          color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
          boxShadow: `0 4px 20px rgba(124,92,255,0.35)`,
        }}>Continue →</button>
      ) : mode === 'instant' ? (
        <button
          className="lb-cta-main"
          onClick={onConnect}
          style={{
            flex: 1, padding: '15px', borderRadius: 12,
            background: `linear-gradient(135deg, #7C5CFF 0%, #6366f1 50%, #4f6ef7 100%)`,
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800,
            letterSpacing: '0.2px',
          }}
        >⚡ Connect now — interpreters ready</button>
      ) : (
        <button
          onClick={onSchedule}
          style={{
            flex: 1, padding: '15px', borderRadius: 12,
            background: `linear-gradient(135deg, #00E5A8, #00b884)`,
            color: '#000', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800,
          }}
        >🗓️ Schedule session</button>
      )}
    </div>
  );
}
