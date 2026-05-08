const DURATIONS = [
  { label: '15 min', value: '15 min', price: '$6.00' },
  { label: '30 min', value: '30 min', price: '$12.00' },
  { label: '45 min', value: '45 min', price: '$18.00' },
  { label: '60 min', value: '60 min', price: '$24.00' },
  { label: '90 min', value: '90 min', price: '$36.00' },
];

export default function DurationSelector({ duration, onChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-full bg-[#5B4FE9] text-white flex items-center justify-center text-xs font-bold">3</span>
        <h3 className="text-sm font-semibold text-gray-900">Duration</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Select session duration</p>

      <div className="grid grid-cols-3 gap-2">
        {DURATIONS.map((d) => {
          const active = duration === d.value;
          return (
            <button
              key={d.value}
              onClick={() => onChange(d.value)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                active
                  ? 'border-[#5B4FE9] bg-[#EEF0FF] text-[#5B4FE9]'
                  : 'border-gray-100 bg-white text-gray-900 hover:border-gray-200'
              }`}
            >
              <p className="text-xs font-semibold">{d.label}</p>
              <p className={`text-[11px] mt-0.5 ${active ? 'text-[#5B4FE9]' : 'text-gray-500'}`}>{d.price}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}