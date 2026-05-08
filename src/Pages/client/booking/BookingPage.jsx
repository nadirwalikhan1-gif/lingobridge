import { useEffect } from 'react';
import useBookingForm from '../hooks/useBookingForm';

/* ─── MOCK DATA ─── */
const INTERPRETERS = [
  { name: 'Maria Garcia',  rating: 4.9, reviews: 128, languages: 'Spanish',       category: 'Medical',  price: '$12.00', img: 'https://i.pravatar.cc/150?u=maria',  online: true },
  { name: 'Carlos Ruiz',   rating: 4.8, reviews: 97,  languages: 'Spanish',       category: 'Legal',    price: '$12.00', img: 'https://i.pravatar.cc/150?u=carlos', online: true },
  { name: 'Aisha Khan',    rating: 4.9, reviews: 156, languages: 'Spanish, English', category: 'Business', price: '$12.00', img: 'https://i.pravatar.cc/150?u=aisha',  online: true },
  { name: 'David Lee',     rating: 4.7, reviews: 86,  languages: 'Spanish, English', category: 'General',  price: '$12.00', img: 'https://i.pravatar.cc/150?u=david',  online: true },
];

const CATEGORIES = [
  { id: 'Medical',    icon: '❤️', color: '#E11D48', bg: '#FFF1F2' },
  { id: 'Legal',      icon: '⚖️', color: '#D97706', bg: '#FEF3C7' },
  { id: 'Business',   icon: '💼', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'Education',  icon: '🎓', color: '#059669', bg: '#ECFDF5' },
  { id: 'Travel',     icon: '✈️', color: '#EA580C', bg: '#FFF7ED' },
  { id: 'General',    icon: '⋯',  color: '#475569', bg: '#F1F5F9' },
];

const DURATIONS = [
  { label: '15 min', value: '15 min', price: '$6.00' },
  { label: '30 min', value: '30 min', price: '$12.00' },
  { label: '45 min', value: '45 min', price: '$18.00' },
  { label: '60 min', value: '60 min', price: '$24.00' },
  { label: '90 min', value: '90 min', price: '$36.00' },
];

const PAYMENT_METHODS = [
  { type: 'visa',    label: '•••• 4242', expiry: 'Expires 12/26', default: true },
  { type: 'mc',      label: '•••• 8888', expiry: 'Expires 10/25', default: false },
  { type: 'paypal',  label: 'john.doe@example.com', expiry: '', default: false },
];

const LANGS = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic'];

/* ─── DESIGN TOKENS ─── */
const C = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  border2: '#CBD5E1',
  text: '#0F172A',
  text2: '#475569',
  text3: '#94A3B8',
  accent: '#4F46E5',
  accentLight: '#EEF2FF',
  accentHover: '#4338CA',
  green: '#10B981',
};

export default function BookingPage({ onConnectNow, onSchedule, resetTrigger }) {
  const {
    step, sessionType, mode, language, purpose, duration, notes,
    set, next, back, reset,
    rate, durationMin, subtotal, platformFee, total,
    bookingData,
  } = useBookingForm();

  /* Reset wizard when call ends (same as before) */
  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  /* Parse language safely for the two dropdowns */
  const [fromLang, toLang] = (typeof language === 'string' && language.includes('→'))
    ? language.split('→').map(s => s.trim())
    : ['English', 'Spanish'];

  const updateLang = (from, to) => set('language', `${from} → ${to}`);

  /* ─── HANDLERS: ZERO CHANGES TO AGORA FLOW ─── */
  const handleConnect  = () => onConnectNow(bookingData);
  const handleSchedule = () => onSchedule(bookingData);

  const isAudio = sessionType === 'audio';
  const isNow   = mode === 'now';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      height: '100%',
      overflow: 'hidden',
      background: C.bg,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div style={{ overflowY: 'auto', padding: '28px 32px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 4, letterSpacing: '-0.2px' }}>
            Book a Session
          </h1>
          <p style={{ fontSize: 13, color: C.text2 }}>
            Choose your preferences and connect with a professional interpreter
          </p>
        </div>

        {/* 3-Step Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          
          {/* 1. Language */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>1</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Language</span>
            </div>
            <p style={{ fontSize: 11, color: C.text2, marginBottom: 12 }}>Select translation language</p>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, color: C.text2, marginBottom: 6, display: 'block', fontWeight: 500 }}>From</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={fromLang}
                  onChange={e => updateLang(e.target.value, toLang)}
                  style={{ width: '100%', appearance: 'none', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 32px 10px 36px', fontSize: 13, color: C.text, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🇺🇸</span>
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.text3, fontSize: 10 }}>▼</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, color: C.text2 }}>
                ⇅
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: C.text2, marginBottom: 6, display: 'block', fontWeight: 500 }}>To</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={toLang}
                  onChange={e => updateLang(fromLang, e.target.value)}
                  style={{ width: '100%', appearance: 'none', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 32px 10px 36px', fontSize: 13, color: C.text, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🇪🇸</span>
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.text3, fontSize: 10 }}>▼</span>
              </div>
            </div>
          </div>

          {/* 2. Session Type */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>2</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Session Type</span>
            </div>
            <p style={{ fontSize: 11, color: C.text2, marginBottom: 12 }}>Choose how you want to connect</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => set('sessionType', 'audio')}
                style={{
                  width: '100%', textAlign: 'left', padding: 14, borderRadius: 12,
                  border: `2px solid ${isAudio ? C.accent : C.border}`,
                  background: isAudio ? C.accentLight : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>🎧</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>Audio Call</div>
                <div style={{ fontSize: 11, color: C.text2 }}>Best for quick conversations</div>
              </button>

              <button
                onClick={() => set('sessionType', 'video')}
                style={{
                  width: '100%', textAlign: 'left', padding: 14, borderRadius: 12,
                  border: `2px solid ${!isAudio ? C.accent : C.border}`,
                  background: !isAudio ? C.accentLight : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>📹</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>Video Call</div>
                <div style={{ fontSize: 11, color: C.text2 }}>Best for detailed communication</div>
              </button>
            </div>
          </div>

          {/* 3. Duration */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>3</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Duration</span>
            </div>
            <p style={{ fontSize: 11, color: C.text2, marginBottom: 12 }}>Select session duration</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {DURATIONS.map(d => {
                const active = duration === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => set('duration', d.value)}
                    style={{
                      padding: '10px 4px', borderRadius: 10,
                      border: `1px solid ${active ? C.accent : C.border}`,
                      background: active ? C.accentLight : '#fff',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? C.accent : C.text }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: active ? C.accent : C.text2, marginTop: 2 }}>{d.price}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* When (preserves mode state from hook) */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>When do you need it?</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => set('mode', 'now')}
              style={{
                flex: 1, padding: 10, borderRadius: 10,
                border: `1px solid ${isNow ? C.accent : C.border}`,
                background: isNow ? C.accentLight : '#fff',
                color: isNow ? C.accent : C.text2,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >📅 Now</button>
            <button
              onClick={() => set('mode', 'schedule')}
              style={{
                flex: 1, padding: 10, borderRadius: 10,
                border: `1px solid ${!isNow ? C.accent : C.border}`,
                background: !isNow ? C.accentLight : '#fff',
                color: !isNow ? C.accent : C.text2,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >📆 Schedule</button>
          </div>
        </div>

        {/* Popular Categories → maps to purpose */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 12 }}>Popular Categories</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {CATEGORIES.map(cat => {
              const active = purpose === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => set('purpose', cat.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 16px', borderRadius: 12,
                    border: `2px solid ${active ? C.accent : C.border}`,
                    background: active ? C.accentLight : C.card,
                    cursor: 'pointer', minWidth: 88,
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: active ? C.accent : C.text }}>{cat.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommended Interpreters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Recommended Interpreters</h3>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, cursor: 'pointer' }}>View All →</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {INTERPRETERS.map((interp, idx) => (
              <div key={idx} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 0 2px ${C.card}` }} />
                <img src={interp.img} alt={interp.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{interp.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 12 }}>⭐</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{interp.rating}</span>
                  <span style={{ fontSize: 11, color: C.text3 }}>({interp.reviews})</span>
                </div>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>{interp.languages}</div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                  background: interp.category === 'Medical' ? '#FFF1F2' : interp.category === 'Legal' ? '#FEF3C7' : interp.category === 'Business' ? '#EFF6FF' : '#F1F5F9',
                  color: interp.category === 'Medical' ? '#E11D48' : interp.category === 'Legal' ? '#D97706' : interp.category === 'Business' ? '#2563EB' : '#475569',
                  fontSize: 10, fontWeight: 700, marginBottom: 8
                }}>
                  {interp.category}
                </span>
                <div style={{ fontSize: 11, color: C.text2 }}>
                  From <span style={{ color: C.accent, fontWeight: 700 }}>{interp.price}</span> / 30 min
                </div>
              </div>
            ))}
            <button style={{ width: 48, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.text3, fontSize: 20, fontWeight: 300 }}>
              ›
            </button>
          </div>
        </div>

        {/* Notes (preserves existing hook field) */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>Additional Notes</h3>
          <textarea
            value={notes || ''}
            onChange={e => set('notes', e.target.value)}
            placeholder="Any special requirements for your session..."
            style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, color: C.text, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        {/* Bottom info bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Need Help?</div>
              <div style={{ fontSize: 11, color: C.text2 }}>Our support team is available 24/7</div>
            </div>
            <button style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 11, fontWeight: 600, color: C.text, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              Contact Support
            </button>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🕐</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>24/7 Support</div>
              <div style={{ fontSize: 11, color: C.text2 }}>We're here to help anytime</div>
            </div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Satisfaction Guarantee</div>
              <div style={{ fontSize: 11, color: C.text2 }}>Love the service or get your money back</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <div style={{
        borderLeft: `1px solid ${C.border}`,
        background: C.card,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Top-right icons (bell, chat, avatar) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, marginBottom: 28 }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <div style={{
              position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
              background: C.accent, color: '#fff', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>2</div>
          </div>
          <span style={{ fontSize: 18, cursor: 'pointer' }}>💬</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <img src="https://i.pravatar.cc/150?u=john" alt="profile" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 10, color: C.text3 }}>▼</span>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Session Summary</h3>

        {/* Summary rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <SummaryRow icon="🌐" label="Language" value={`${fromLang} → ${toLang}`} />
          <SummaryRow icon={isAudio ? '🎧' : '📹'} label="Type" value={isAudio ? 'Audio Call' : 'Video Call'} />
          <SummaryRow icon="⏱️" label="Duration" value={durationMin ? `${durationMin} Minutes` : (duration || '30 min')} />
          <SummaryRow icon="📅" label="Date & Time" value={isNow ? 'Today, 10:30 AM' : 'Scheduled'} />
        </div>

        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />

        <h4 style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 12 }}>Price Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: C.text2 }}>Base Price ({durationMin || '30'} min)</span>
            <span style={{ color: C.text, fontWeight: 500 }}>${subtotal?.toFixed(2) || '12.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}>
              Platform Fee <span style={{ cursor: 'help', fontSize: 10 }}>ⓘ</span>
            </span>
            <span style={{ color: C.text, fontWeight: 500 }}>${platformFee?.toFixed(2) || '0.60'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Total Price</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>${total?.toFixed(2) || '12.60'}</span>
        </div>

        {/* Secure badge */}
        <div style={{ background: C.accentLight, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>100% Secure Booking</div>
            <div style={{ fontSize: 11, color: C.accent, opacity: 0.8, marginTop: 2 }}>Your payment is protected. No hidden charges.</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={isNow ? handleConnect : handleSchedule}
          style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: C.accent, color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 10, boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            transition: 'transform 0.15s', fontFamily: 'inherit'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: 16 }}>📞</span> {isNow ? 'Connect Now' : 'Schedule Session'}
        </button>

        <p style={{ fontSize: 11, color: C.text3, textAlign: 'center', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span>🛡️</span> You will be connected to the best available interpreter
        </p>

        {/* Saved Payment Methods */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Saved Payment Methods</h4>
            <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Manage</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PAYMENT_METHODS.map((pm, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10,
                border: `1px solid ${pm.default ? C.accent : C.border}`,
                background: pm.default ? C.accentLight : '#fff',
                cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 900, padding: '2px 5px', borderRadius: 3,
                  background: pm.type === 'visa' ? '#1D4ED8' : pm.type === 'mc' ? '#DC2626' : '#003087',
                  color: '#fff', letterSpacing: 0.5
                }}>
                  {pm.type === 'visa' ? 'VISA' : pm.type === 'mc' ? 'MC' : 'PP'}
                </span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.text }}>{pm.label}</span>
                {pm.expiry && <span style={{ fontSize: 10, color: C.text3 }}>{pm.expiry}</span>}
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${pm.default ? C.accent : C.border2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {pm.default && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', fontSize: 12 }}>
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A' }}>{value}</span>
    </div>
  );
}