const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function Header({ title = '', subtitle = '', actions, user, notifCount = 0, showSearch = true }) {
  return (
    <header className="shrink-0 flex items-center gap-4 border-b border-[var(--border)] px-8"
      style={{ height: 58, background: 'rgba(13,21,38,0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 30 }}>
      <div className="flex-1 min-w-0">
        {title && <h1 className="text-sm font-bold text-[var(--text-white)] tracking-tight truncate leading-none">{title}</h1>}
        {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">{subtitle}</p>}
      </div>

      {showSearch && (
        <div className="relative hidden md:flex items-center">
          <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none"><SearchIcon /></span>
          <input type="text" placeholder="Search…" className="input-base pl-8 text-xs"
            style={{ width: 200, height: 34, padding: '0 12px 0 32px', fontSize: 12 }} />
        </div>
      )}

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}

      <button className="relative flex items-center justify-center rounded-lg transition-all duration-150 shrink-0"
        style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-strong)', color: 'var(--text-sec)' }}>
        <BellIcon />
        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold"
            style={{ width: 16, height: 16, fontSize: 9, background: 'var(--primary)', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }}>
            {notifCount > 9 ? '9+' : notifCount}
          </span>
        )}
      </button>

      {user && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center rounded-full text-xs font-bold text-white cursor-pointer"
            style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 10px rgba(99,102,241,0.35)' }}
            title={user.name}>
            {user.initials}
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-[var(--text-white)] leading-none">{user.name}</p>
            <p className="text-[11px] text-[var(--text-muted)] capitalize mt-0.5">{user.role}</p>
          </div>
        </div>
      )}
    </header>
  );
}