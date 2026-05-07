import { useState } from 'react';

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const LogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Sidebar({ navGroups = [], activeId, onNav, user, onLogout, logo }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className="relative flex flex-col shrink-0 border-r border-[var(--border)] transition-all duration-300"
      style={{ width: collapsed ? 64 : 220, background: 'var(--bg-card)', minHeight: '100vh' }}>
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] shrink-0 overflow-hidden"
        style={{ height: 58, padding: collapsed ? '0 16px' : '0 20px' }}>
        <div className="shrink-0 flex items-center justify-center rounded-lg text-base"
          style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', boxShadow: '0 0 14px rgba(99,102,241,0.4)' }}>
          🌐
        </div>
        {!collapsed && !logo && <span className="text-sm font-extrabold text-[var(--text-white)] tracking-tight whitespace-nowrap">LingoBridge</span>}
        {!collapsed && logo && logo}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col gap-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-1">
            {group.label && !collapsed && <span className="section-label block px-2 pt-3 pb-1.5">{group.label}</span>}
            {group.items.map((item) => (
              <button key={item.id} onClick={() => onNav?.(item.id)}
                className={['nav-item', activeId === item.id ? 'active' : ''].join(' ')}
                title={collapsed ? item.label : undefined}>
                <span className="shrink-0 flex items-center justify-center" style={{ width: 18, height: 18 }}>{item.icon}</span>
                {!collapsed && <span className="truncate flex-1 text-left text-[13px]">{item.label}</span>}
                {!collapsed && item.badge != null && (
                  <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: 'var(--primary)', color: 'white', minWidth: 18, textAlign: 'center' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {user && (
        <div className="shrink-0 border-t border-[var(--border)] flex items-center gap-2.5 overflow-hidden"
          style={{ padding: '12px 16px' }}>
          <div className="shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 0 10px rgba(99,102,241,0.35)' }}>
            {user.initials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-white)] truncate">{user.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate capitalize">{user.role}</p>
              </div>
              {onLogout && (
                <button onClick={onLogout} className="shrink-0 text-[var(--text-muted)] hover:text-rose-400 transition-colors" title="Sign out">
                  <LogOut />
                </button>
              )}
            </>
          )}
        </div>
      )}

      <button onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[70px] z-10 flex items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-200"
        style={{ width: 22, height: 22, background: 'var(--bg-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </aside>
  );
}