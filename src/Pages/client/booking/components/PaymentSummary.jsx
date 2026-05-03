const C = {
  bg2: '#121826', bg3: '#1A2235',
  border: 'rgba(255,255,255,0.06)',
  accent: '#7C5CFF', accentDim: 'rgba(124,92,255,0.12)',
  accentBorder: 'rgba(124,92,255,0.35)',
  green: '#00E5A8', greenDim: 'rgba(0,229,168,0.12)',
  greenBorder: 'rgba(0,229,168,0.35)',
  t1: '#FFFFFF', t2: '#A0AEC0', t3: '#64748B',
};

const DEFAULT_CARDS = [
  { last4: '4242', expiry: '04/28', brand: 'VISA', isDefault: true  },
  { last4: '8888', expiry: '09/27', brand: 'MC',   isDefault: false },
];

export default function PaymentSummary({ sessionType, durationMin, rate, subtotal, platformFee, total }) {
  return (
    <div style={{
      padding: '24px 20px',
      borderLeft: `1px solid ${C.border}`,
      background: '#0B0F1A',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Cost breakdown */}
      <div style={{
        background: C.bg2, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 18,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, marginBottom: 14 }}>
          PAYMENT SUMMARY
        </div>
        {[
          { label: 'Session type', value: sessionType === 'video' ? 'Video call' : 'Audio call' },
          { label: 'Rate',         value: `$${rate.toFixed(2)} / min` },
          { label: 'Duration',     value: `${durationMin} min` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 10,
          }}>
            <span style={{ fontSize: 12, color: C.t3 }}>{label}</span>
            <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: C.border, margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: C.t3 }}>Subtotal</span>
          <span style={{ fontSize: 12, color: C.t2, fontWeight: 600 }}>${subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: C.t3 }}>Platform fee</span>
          <span style={{ fontSize: 12, color: C.t2, fontWeight: 600 }}>${platformFee.toFixed(2)}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 14px',
          background: C.accentDim, border: `1px solid ${C.accentBorder}`,
          borderRadius: 10,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: C.t1 }}>${total}</span>
        </div>
      </div>

      {/* Payment methods */}
      <div style={{
        background: C.bg2, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 18,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1, marginBottom: 12 }}>
          PAY WITH
        </div>
        {DEFAULT_CARDS.map((card, i) => (
          <div key={i} className="lb-saved-card" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            border: `1px solid ${card.isDefault ? C.accentBorder : C.border}`,
            background: card.isDefault ? C.accentDim : C.bg3,
            marginBottom: 8, cursor: 'pointer',
          }}>
            <span style={{
              fontSize: 9, fontWeight: 900, padding: '2px 5px', borderRadius: 3,
              background: card.brand === 'VISA' ? '#1a56db' : '#2a2a2a', color: '#fff',
              letterSpacing: 0.5,
            }}>{card.brand}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>•••• {card.last4}</div>
              <div style={{ fontSize: 10, color: C.t3 }}>Exp {card.expiry}</div>
            </div>
            {card.isDefault && (
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: '#fff', fontWeight: 900,
              }}>✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Security badge */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 14px',
        background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: 10,
      }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>100% secure payment</span>
      </div>
    </div>
  );
}
