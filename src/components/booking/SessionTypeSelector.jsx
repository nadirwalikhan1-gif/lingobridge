import { Headphones, Video } from 'lucide-react';

export default function SessionTypeSelector({ sessionType, onChange }) {
  const options = [
    { id: 'audio', label: 'Audio Call', sub: 'Best for quick conversations', icon: Headphones },
    { id: 'video', label: 'Video Call', sub: 'Best for detailed communication', icon: Video },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-full bg-[#5B4FE9] text-white flex items-center justify-center text-xs font-bold">2</span>
        <h3 className="text-sm font-semibold text-gray-900">Session Type</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Choose how you want to connect</p>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = sessionType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                active
                  ? 'border-[#5B4FE9] bg-[#EEF0FF]'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${active ? 'text-[#5B4FE9]' : 'text-gray-400'}`} />
              <p className={`text-xs font-semibold ${active ? 'text-[#5B4FE9]' : 'text-gray-900'}`}>{opt.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{opt.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}