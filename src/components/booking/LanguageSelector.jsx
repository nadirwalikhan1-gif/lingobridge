import { ArrowUpDown } from 'lucide-react';

const LANGS = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic'];
const FLAGS = { English: '🇺🇸', Spanish: '🇪🇸', French: '🇫🇷', Mandarin: '🇨🇳', Arabic: '🇸🇦' };

export default function LanguageSelector({ language, onChange }) {
  const [from, to] = (language && language.includes('→'))
    ? language.split('→').map(s => s.trim())
    : ['English', 'Spanish'];

  const update = (f, t) => onChange(`${f} → ${t}`);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-full bg-[#5B4FE9] text-white flex items-center justify-center text-xs font-bold">1</span>
        <h3 className="text-sm font-semibold text-gray-900">Language</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">Select translation language</p>

      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] text-gray-500 font-medium mb-1 block">From</label>
          <div className="relative">
            <select
              value={from}
              onChange={e => update(e.target.value, to)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B4FE9]/20 focus:border-[#5B4FE9]"
            >
              {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{FLAGS[from]}</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none">▼</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => update(to, from)}
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#5B4FE9] hover:border-[#5B4FE9]/30 transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <label className="text-[11px] text-gray-500 font-medium mb-1 block">To</label>
          <div className="relative">
            <select
              value={to}
              onChange={e => update(from, e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B4FE9]/20 focus:border-[#5B4FE9]"
            >
              {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{FLAGS[to]}</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}