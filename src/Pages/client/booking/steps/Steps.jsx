// ─── STEP COMPONENTS ────────────────────────────────────────────
// Each step receives only what it needs — no form object passed whole.

const C = {
  accent: '#7C5CFF', accentLight: '#9F84FF',
  accentDim: 'rgba(124,92,255,0.12)', accentBorder: 'rgba(124,92,255,0.35)',
  accentGlow: 'rgba(124,92,255,0.5)',
  green: '#00E5A8', greenDim: 'rgba(0,229,168,0.12)',
  greenBorder: 'rgba(0,229,168,0.35)',
  bg3: '#1A2235', border: 'rgba(255,255,255,0.06)',
  t1: '#FFFFFF', t2: '#A0AEC0', t3: '#64748B',
  font: "'Inter', sans-serif",
};

const LANGUAGES = [
  'Arabic','Spanish','French','Mandarin','Portuguese',
  'Russian','German','Japanese','Italian','Hindi','Turkish',
  'Dutch','Korean','Swedish','Vietnamese','Urdu',
];

const PURPOSES = [
  { id:'medical',    icon:'❤️',  label:'Medical',    sub:'Hospital & clinic',  color:'#FF4D6D', dimColor:'rgba(255,77,109,0.12)',  borderColor:'rgba(255,77,109,0.35)'  },
  { id:'legal',      icon:'⚖️',  label:'Legal',      sub:'Court & contracts',  color:'#F5C542', dimColor:'rgba(245,197,66,0.12)',  borderColor:'rgba(245,197,66,0.35)'  },
  { id:'business',   icon:'💼',  label:'Business',   sub:'Meetings & deals',   color:'#3BA4FF', dimColor:'rgba(59,164,255,0.12)',  borderColor:'rgba(59,164,255,0.35)'  },
  { id:'government', icon:'🏛️', label:'Government', sub:'Official services',  color:'#00E5A8', dimColor:'rgba(0,229,168,0.12)',   borderColor:'rgba(0,229,168,0.35)'   },
  { id:'education',  icon:'🎓',  label:'Education',  sub:'Schools & learning', color:'#7C5CFF', dimColor:'rgba(124,92,255,0.12)',  borderColor:'rgba(124,92,255,0.35)'  },
  { id:'other',      icon:'💬',  label:'Other',      sub:'General purpose',    color:'#A0AEC0', dimColor:'rgba(160,174,192,0.1)',  borderColor:'rgba(160,174,192,0.25)' },
];

const DURATIONS = ['15 min', '30 min', '1 hour', '2+ hrs'];

// ── STEP 1: SESSION TYPE ─────────────────────────────────────────
export function StepSessionType({ sessionType, onChange }) {
  const types = [
    {
      id:'audio', icon:'🎙️', label:'Audio call', sub:'Voice-only • $0.90/min',
      iconBg:'linear-gradient(135deg,#00E5A8,#00b884)',
      activeColor:'#00E5A8', activeDim:'rgba(0,229,168,0.12)',
      activeBorder:'rgba(0,229,168,0.4)', activeGlow:'rgba(0,229,168,0.25)',
    },
    {
      id:'video', icon:'📹', label:'Video call', sub:'Face-to-face • $1.20/min',
      iconBg:'linear-gradient(135deg,#7C5CFF,#6366f1)',
      activeColor:C.accent, activeDim:C.accentDim,
      activeBorder:C.accentBorder, activeGlow:C.accentGlow,
    },
  ];

  return (
    <div style={{ animation:'fadeSlideIn 0.22s ease both' }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:6 }}>Choose session type</div>
      <div style={{ fontSize:12, color:C.t3, marginBottom:18 }}>Select how you'd like to connect with your interpreter</div>
      <div style={{ display:'flex', gap:12 }}>
        {types.map(t => {
          const active = sessionType === t.id;
          return (
            <div key={t.id} className="lb-session-card" onClick={() => onChange(t.id)} style={{
              flex:1, padding:'20px 18px', borderRadius:14,
              border: active ? `1px solid ${t.activeBorder}` : `1px solid ${C.border}`,
              background: active ? t.activeDim : C.bg3,
              boxShadow: active ? `0 0 0 1px ${t.activeBorder}, 0 8px 28px ${t.activeGlow}` : 'none',
              position:'relative', overflow:'hidden', cursor:'pointer',
            }}>
              {active && (
                <div style={{
                  position:'absolute', top:12, right:12,
                  width:18, height:18, borderRadius:'50%',
                  background:t.activeColor,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, color:'#000', fontWeight:800,
                  boxShadow:`0 0 8px ${t.activeGlow}`,
                }}>✓</div>
              )}
              <div style={{
                width:40, height:40, borderRadius:10,
                background:t.iconBg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, marginBottom:14,
                boxShadow: active ? `0 4px 14px ${t.activeGlow}` : 'none',
              }}>{t.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.t1, marginBottom:4 }}>{t.label}</div>
              <div style={{ fontSize:11, color: active ? t.activeColor : C.t3, fontWeight:500 }}>{t.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 2: WHEN ─────────────────────────────────────────────────
export function StepWhen({ mode, onChange }) {
  const modes = [
    {
      id:'instant', icon:'⚡', label:'Connect now', badge:'14 online', badgeSub:'Avg wait < 30 sec',
      activeColor:C.green, activeDim:C.greenDim, activeBorder:C.greenBorder,
      activeGlow:'rgba(0,229,168,0.2)',
    },
    {
      id:'schedule', icon:'🗓️', label:'Schedule later', badge:null, badgeSub:'Choose your slot',
      activeColor:C.accent, activeDim:C.accentDim, activeBorder:C.accentBorder,
      activeGlow:C.accentGlow,
    },
  ];

  return (
    <div style={{ animation:'fadeSlideIn 0.22s ease both' }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:6 }}>When do you need it?</div>
      <div style={{ fontSize:12, color:C.t3, marginBottom:18 }}>Connect immediately or plan ahead</div>
      <div style={{ display:'flex', gap:12 }}>
        {modes.map(m => {
          const active = mode === m.id;
          return (
            <div key={m.id} className="lb-when-card" onClick={() => onChange(m.id)} style={{
              flex:1, padding:'20px 18px', borderRadius:14,
              border: active ? `1px solid ${m.activeBorder}` : `1px solid ${C.border}`,
              background: active ? m.activeDim : C.bg3,
              boxShadow: active ? `0 0 0 1px ${m.activeBorder}, 0 10px 28px ${m.activeGlow}` : 'none',
              position:'relative', cursor:'pointer',
            }}>
              {active && (
                <div style={{
                  position:'absolute', top:12, right:12,
                  width:18, height:18, borderRadius:'50%',
                  background:m.activeColor,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, color:'#000', fontWeight:800,
                }}>✓</div>
              )}
              <div style={{ fontSize:22, marginBottom:12 }}>{m.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.t1, marginBottom:6 }}>{m.label}</div>
              {m.badge && (
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'4px 10px', background:C.greenDim,
                  border:`1px solid ${C.greenBorder}`,
                  borderRadius:20, marginBottom:8,
                }}>
                  <span style={{
                    width:6, height:6, borderRadius:'50%',
                    background:C.green,
                    animation:'dotPulse 2s ease-in-out infinite',
                    display:'inline-block', boxShadow:`0 0 6px ${C.green}`,
                  }}/>
                  <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>{m.badge} interpreters</span>
                </div>
              )}
              <div style={{ fontSize:11, color: active ? m.activeColor : C.t3, fontWeight:500 }}>{m.badgeSub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 3: LANGUAGE ─────────────────────────────────────────────
export function StepLanguage({ language, onChange }) {
  const popular = ['Arabic','Spanish','French','Mandarin','Hindi','Urdu'];
  return (
    <div style={{ animation:'fadeSlideIn 0.22s ease both' }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:6 }}>Select language</div>
      <div style={{ fontSize:12, color:C.t3, marginBottom:18 }}>Choose the language pair for your session</div>
      <div style={{
        position:'relative', background:C.bg3,
        border:`1px solid rgba(255,255,255,0.1)`, borderRadius:12, overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          fontSize:18, pointerEvents:'none', zIndex:1,
        }}>🌐</div>
        <select
          className="lb-lang-select"
          value={language}
          onChange={e => onChange(e.target.value)}
          style={{
            width:'100%', padding:'14px 44px 14px 44px',
            background:'transparent', color:C.t1,
            fontSize:13, fontWeight:600, fontFamily:C.font,
            border:'none', appearance:'none', cursor:'pointer', outline:'none',
          }}
        >
          {LANGUAGES.map(l => <option key={l} style={{ background:C.bg3 }}>{l}</option>)}
        </select>
        <div style={{
          position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          color:C.t3, pointerEvents:'none', fontSize:12,
        }}>▼</div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:14 }}>
        {popular.map(l => (
          <button key={l} onClick={() => onChange(l)} style={{
            padding:'5px 13px', borderRadius:20,
            border:`1px solid ${language === l ? C.accentBorder : C.border}`,
            background: language === l ? C.accentDim : C.bg3,
            color: language === l ? C.accent : C.t3,
            fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:C.font,
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// ── STEP 4: PURPOSE ──────────────────────────────────────────────
export function StepPurpose({ purpose, onChange }) {
  return (
    <div style={{ animation:'fadeSlideIn 0.22s ease both' }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:6 }}>What's the purpose?</div>
      <div style={{ fontSize:12, color:C.t3, marginBottom:18 }}>This helps us match the right interpreter for you</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        {PURPOSES.map(p => {
          const active = purpose === p.id;
          return (
            <div key={p.id} className="lb-purpose-card" onClick={() => onChange(p.id)} style={{
              padding:'16px 14px', borderRadius:12, cursor:'pointer',
              border: active ? `1px solid ${p.borderColor}` : `1px solid ${C.border}`,
              background: active ? p.dimColor : C.bg3,
              boxShadow: active ? `0 0 0 1px ${p.borderColor}, 0 6px 20px ${p.dimColor}` : 'none',
              position:'relative', textAlign:'left',
            }}>
              {active && (
                <div style={{
                  position:'absolute', top:10, right:10,
                  width:16, height:16, borderRadius:'50%',
                  background:p.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:9, color:'#000', fontWeight:900,
                }}>✓</div>
              )}
              <div style={{
                width:34, height:34, borderRadius:9,
                background: active ? p.dimColor : 'rgba(255,255,255,0.04)',
                border:`1px solid ${active ? p.borderColor : C.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16, marginBottom:10,
              }}>{p.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color: active ? p.color : C.t1, marginBottom:2 }}>{p.label}</div>
              <div style={{ fontSize:10, color:C.t3 }}>{p.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 5: DURATION ─────────────────────────────────────────────
export function StepDuration({ duration, notes, onDurationChange, onNotesChange, rate }) {
  const durationMins = { '15 min':15, '30 min':30, '1 hour':60, '2+ hrs':120 };
  return (
    <div style={{ animation:'fadeSlideIn 0.22s ease both' }}>
      <div style={{ fontSize:15, fontWeight:700, color:C.t1, marginBottom:6 }}>Session duration</div>
      <div style={{ fontSize:12, color:C.t3, marginBottom:18 }}>You'll only be charged for the actual time used</div>
      <div style={{ display:'flex', gap:10 }}>
        {DURATIONS.map(d => {
          const active = duration === d;
          return (
            <button key={d} onClick={() => onDurationChange(d)} style={{
              flex:1, padding:'18px 10px', borderRadius:12,
              border: active ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
              background: active
                ? `linear-gradient(135deg, ${C.accentDim}, rgba(99,102,241,0.08))`
                : C.bg3,
              color: active ? C.accent : C.t2,
              fontFamily:C.font, fontWeight:700, fontSize:13, cursor:'pointer',
              boxShadow: active ? `0 0 0 1px ${C.accentBorder}, 0 6px 20px ${C.accentGlow}` : 'none',
            }}>
              {d}
              {active && (
                <div style={{ fontSize:10, color:C.accentLight, marginTop:4, fontWeight:500 }}>
                  ~${(rate * (durationMins[d] || 30)).toFixed(2)}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.t2, marginBottom:8 }}>
          Additional notes <span style={{ color:C.t3, fontWeight:400 }}>(optional)</span>
        </div>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="e.g. Medical terminology, specific dialect needed..."
          rows={3}
          style={{
            width:'100%', padding:'12px 14px',
            background:C.bg3, border:`1px solid ${C.border}`,
            borderRadius:10, color:C.t1, fontSize:12,
            fontFamily:C.font, resize:'none', outline:'none',
            colorScheme:'dark', lineHeight:1.6,
          }}
        />
      </div>
    </div>
  );
}
