import { Bell, MessageSquare, ChevronDown } from 'lucide-react';

const TITLES = {
  booking: { title: 'Book a Session', sub: 'Choose your preferences and connect with a professional interpreter' },
  history: { title: 'My Sessions', sub: 'View and manage your interpretation history' },
  wallet: { title: 'Payments', sub: 'Manage your payment methods and billing' },
  messages: { title: 'Messages', sub: 'Chat with interpreters and support' },
  favorites: { title: 'Favorites', sub: 'Your saved interpreters' },
  profile: { title: 'Profile', sub: 'Manage your account details' },
  settings: { title: 'Settings', sub: 'App preferences and notifications' },
  help: { title: 'Help & Support', sub: 'Get assistance anytime' },
};

export default function Topbar({ page = 'booking' }) {
  const meta = TITLES[page] || TITLES.booking;
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{meta.title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{meta.sub}</p>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#5B4FE9] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
        </button>
        
        <button className="text-gray-500 hover:text-gray-900 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
        
        <button className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/150?u=john" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}