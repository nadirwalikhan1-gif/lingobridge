import { Phone, Shield, HelpCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { type: 'visa', label: '•••• 4242', expiry: 'Expires 12/26', default: true },
  { type: 'mc', label: '•••• 8888', expiry: 'Expires 10/25', default: false },
  { type: 'paypal', label: 'john.doe@example.com', expiry: '', default: false },
];

const fmt = (val, fallback = '0.00') => {
  const n = Number(val);
  return Number.isFinite(n) ? n.toFixed(2) : fallback;
};

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5 text-gray-500">
        <span className="text-sm">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function SessionSummary({
  language,
  sessionType,
  duration,
  durationMin,
  mode,
  subtotal,
  platformFee,
  total,
  onConnect,
  onSchedule,
}) {
  const [fromLang, toLang] = (language && language.includes('→'))
    ? language.split('→').map(s => s.trim())
    : ['English', 'Spanish'];

  const isNow = mode === 'now';

  return (
    <aside className="w-[320px] min-w-[320px] bg-white border-l border-gray-200 h-full overflow-y-auto p-6 flex flex-col">
      {/* Top icons */}
      <div className="flex items-center justify-end gap-4 mb-7">
        <button className="relative text-gray-500 hover:text-gray-900">
          <span className="text-lg">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B4FE9] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
        </button>
        <button className="text-gray-500 hover:text-gray-900 text-lg">💬</button>
        <button className="flex items-center gap-1">
          <img src="https://i.pravatar.cc/150?u=john" alt="" className="w-8 h-8 rounded-full object-cover" />
          <span className="text-gray-400 text-xs">▼</span>
        </button>
      </div>

      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Session Summary</h3>

      <div className="space-y-2.5 mb-4">
        <Row icon="🌐" label="Language" value={`${fromLang} → ${toLang}`} />
        <Row icon={sessionType === 'video' ? '📹' : '🎧'} label="Type" value={sessionType === 'video' ? 'Video Call' : 'Audio Call'} />
        <Row icon="⏱️" label="Duration" value={durationMin ? `${durationMin} Minutes` : (duration || '30 min')} />
        <Row icon="📅" label="Date & Time" value={isNow ? 'Today, 10:30 AM' : 'Scheduled'} />
      </div>

      <div className="h-px bg-gray-100 mb-4" />

      <h4 className="text-xs font-bold text-gray-900 mb-2.5">Price Breakdown</h4>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Base Price ({durationMin || '30'} min)</span>
          <span className="font-medium text-gray-900">${fmt(subtotal, '12.00')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            Platform Fee <HelpCircle className="w-3 h-3 text-gray-400" />
          </span>
          <span className="font-medium text-gray-900">${fmt(platformFee, '0.60')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-900">Total Price</span>
        <span className="text-2xl font-extrabold text-[#5B4FE9]">${fmt(total, '12.60')}</span>
      </div>

      <div className="bg-[#EEF0FF] rounded-xl p-3 flex items-start gap-2.5 mb-4">
        <Shield className="w-4 h-4 text-[#5B4FE9] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#5B4FE9]">100% Secure Booking</p>
          <p className="text-[11px] text-[#5B4FE9]/70 mt-0.5">Your payment is protected. No hidden charges.</p>
        </div>
      </div>

      <button
        onClick={isNow ? onConnect : onSchedule}
        className="w-full py-3 rounded-xl bg-[#5B4FE9] text-white text-sm font-bold flex items-center justify-center gap-2 mb-2.5 hover:bg-[#4A3FD4] transition-all animate-cta-glow"
      >
        <Phone className="w-4 h-4" />
        {isNow ? 'Connect Now' : 'Schedule Session'}
      </button>

      <p className="text-[11px] text-gray-400 text-center mb-5 flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        You will be connected to the best available interpreter
      </p>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold text-gray-900">Saved Payment Methods</h4>
          <button className="text-[11px] font-semibold text-[#5B4FE9] hover:text-[#4A3FD4]">Manage</button>
        </div>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((pm, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                pm.default
                  ? 'border-[#5B4FE9] bg-[#EEF0FF]'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white ${
                pm.type === 'visa' ? 'bg-blue-700' : pm.type === 'mc' ? 'bg-red-600' : 'bg-blue-900'
              }`}>
                {pm.type === 'visa' ? 'VISA' : pm.type === 'mc' ? 'MC' : 'PP'}
              </span>
              <span className="flex-1 text-xs font-semibold text-gray-900">{pm.label}</span>
              {pm.expiry && <span className="text-[10px] text-gray-400">{pm.expiry}</span>}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                pm.default ? 'border-[#5B4FE9]' : 'border-gray-200'
              }`}>
                {pm.default && <div className="w-2 h-2 rounded-full bg-[#5B4FE9]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}