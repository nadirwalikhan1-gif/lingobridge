import { Star, ChevronRight } from 'lucide-react';

const INTERPRETERS = [
  { name: 'Maria Garcia', rating: 4.9, reviews: 128, languages: 'Spanish', category: 'Medical', price: '$12.00', img: 'https://i.pravatar.cc/150?u=maria', online: true },
  { name: 'Carlos Ruiz', rating: 4.8, reviews: 97, languages: 'Spanish', category: 'Legal', price: '$12.00', img: 'https://i.pravatar.cc/150?u=carlos', online: true },
  { name: 'Aisha Khan', rating: 4.9, reviews: 156, languages: 'Spanish, English', category: 'Business', price: '$12.00', img: 'https://i.pravatar.cc/150?u=aisha', online: true },
  { name: 'David Lee', rating: 4.7, reviews: 86, languages: 'Spanish, English', category: 'General', price: '$12.00', img: 'https://i.pravatar.cc/150?u=david', online: true },
];

const BADGE_STYLES = {
  Medical: 'bg-rose-50 text-rose-600',
  Legal: 'bg-amber-50 text-amber-600',
  Business: 'bg-blue-50 text-blue-600',
  General: 'bg-slate-50 text-slate-600',
};

export default function InterpreterCards() {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Recommended Interpreters</h3>
        <button className="text-xs font-semibold text-[#5B4FE9] hover:text-[#4A3FD4]">View All</button>
      </div>
      
      <div className="flex gap-3">
        {INTERPRETERS.map((interp, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 flex-1 text-center relative min-w-[160px] hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
            
            <img src={interp.img} alt={interp.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2.5" />
            
            <h4 className="text-xs font-semibold text-gray-900 mb-0.5">{interp.name}</h4>
            
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-900">{interp.rating}</span>
              <span className="text-[11px] text-gray-400">({interp.reviews})</span>
            </div>
            
            <p className="text-[11px] text-gray-500 mb-1.5">{interp.languages}</p>
            
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${BADGE_STYLES[interp.category]}`}>
              {interp.category}
            </span>
            
            <p className="text-[11px] text-gray-500">
              From <span className="text-[#5B4FE9] font-bold">{interp.price}</span> / 30 min
            </p>
          </div>
        ))}
        
        <button className="bg-white rounded-2xl border border-gray-100 w-10 flex items-center justify-center text-gray-400 hover:text-[#5B4FE9] hover:border-[#5B4FE9]/30 transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}