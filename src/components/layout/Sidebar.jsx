import {
  CalendarDays,
  Clock,
  Wallet,
  MessageSquare,
  Heart,
  User,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
} from 'lucide-react';

const NAV = [
  { id: 'booking', label: 'Book a Session', icon: CalendarDays, active: true },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar({ activePage = 'booking', onNav }) {
  return (
    <aside className="w-[220px] min-w-[220px] bg-[#1E1B4B] text-white flex flex-col h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[#1E1B4B]" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold leading-tight">LingoBridge</h1>
          <p className="text-[10px] text-white/40 leading-tight">Connect. Communicate. Anywhere.</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;
          return (
            <button
              key={item.id}
              onClick={() => onNav?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[#5B4FE9] text-white shadow-lg shadow-[#5B4FE9]/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-[#5B4FE9] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Wallet */}
      <div className="px-3 pb-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Wallet Balance</p>
          <p className="text-[22px] font-bold mb-3">$45.60</p>
          <button className="w-full py-2 rounded-lg bg-[#5B4FE9]/10 border border-[#5B4FE9]/30 text-[#5B4FE9] text-xs font-semibold hover:bg-[#5B4FE9]/20 transition-all flex items-center justify-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Funds
          </button>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-5">
        <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=john" alt="John Doe" className="w-9 h-9 rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1E1B4B]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate">John Doe</p>
            <p className="text-[11px] text-white/40">Client</p>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </div>
      </div>
    </aside>
  );
}