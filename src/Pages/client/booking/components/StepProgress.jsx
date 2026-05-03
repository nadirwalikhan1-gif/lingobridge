const C = {
  accent: '#7C5CFF', accentLight: '#9F84FF',
  accentGlow: 'rgba(124,92,255,0.5)', bg3: '#1A2235',
  t1: '#FFFFFF', t2: '#A0AEC0', t3: '#64748B',
};

const STEP_LABELS = [
  'Session type', 'When do you need it?',
  'Language', 'Purpose', 'Duration',
];

export default function StepProgress({ step }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>
          Step {step} of 5 —{' '}
          <span style={{ color: C.t1 }}>{STEP_LABELS[step - 1]}</span>
        </span>
        <span style={{ fontSize: 11, color: C.t3 }}>{Math.round((step / 5) * 100)}% complete</span>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} style={{
            flex: 1, height: 4, borderRadius: 10,
            background: n < step
              ? C.accent
              : n === step
              ? `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`
              : C.bg3,
            boxShadow: n === step ? `0 0 8px ${C.accentGlow}` : 'none',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}
