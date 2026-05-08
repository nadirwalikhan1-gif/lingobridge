import { Heart, Scale, Briefcase, GraduationCap, Plane, MoreHorizontal } from 'lucide-react';

const CATS = [
  { id: 'Medical', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { id: 'Legal', icon: Scale, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: 'Business', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'Education', icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { id: 'Travel', icon: Plane, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { id: 'General', icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
];

export default function CategoryGrid({ purpose, onChange }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Categories</h3>
      <div className="flex gap-3">
        {CATS.map((cat) => {
          const Icon = cat.icon;
          const active = purpose === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 min-w-[88px] transition-all ${
                active
                  ? 'border-[#5B4FE9] bg-[#EEF0FF]'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className={`w-9 h-9 rounded-full ${cat.bg} ${cat.border} border flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${cat.color}`} />
              </div>
              <span className={`text-[11px] font-semibold ${active ? 'text-[#5B4FE9]' : 'text-gray-900'}`}>{cat.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}