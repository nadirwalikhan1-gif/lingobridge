// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const IC = {
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Radio: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.34 19.34 0 0 1 5 12.37 19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Dollar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Monitor: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  MoreVertical: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  UserPlus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  Support: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  VideoIcon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  PhoneSmall: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.34 19.34 0 0 1 5 12.37 19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  XSmall: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Headphones: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   SPARKLINE  (fixed single-point crash)
───────────────────────────────────────────── */
function Sparkline({ color = '#6366f1', data = [], height = 40 }) {
  const w = 120;
  const h = height;
  if (!data || data.length < 2) {
    return <div style={{ height: h, width: w }} />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const pathD = `M${pts.join(' L')}`;
  const fillD = `${pathD} L${w},${h} L0,${h} Z`;
  const id = `sg${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────── */
function DonutChart({ segments = [] }) {
  const r = 50;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  if (!segments || segments.length === 0) return null;

  let offset = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ filter: `drop-shadow(0 0 4px ${seg.color}66)` }}
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={r - 10} fill="#0d1526" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────── */
function Avatar({ initials, size = 32 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STATUS DOT
───────────────────────────────────────────── */
function StatusDot({ status }) {
  const map = {
    online: { color: '#10b981', label: 'On call' },
    idle: { color: '#f59e0b', label: 'Idle' },
    offline: { color: '#ef4444', label: 'Offline' },
    available: { color: '#6366f1', label: 'Available' },
  };
  const { color, label } = map[status] || { color: '#94a3b8', label: status };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
        borderRadius: 999,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 5px ${color}`,
        }}
      />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SPARKDATA = {
  revenue: [42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85, 80],
  profit: [28, 24, 35, 30, 42, 38, 48, 44, 52, 48, 58, 55],
  sessions: [820, 780, 900, 860, 950, 910, 1020, 980, 1100, 1060, 1180, 1245],
  active: [12, 15, 18, 14, 20, 17, 22, 19, 16, 21, 18, 19],
  interpreters: [40, 42, 45, 43, 47, 44, 48, 46, 50, 47, 49, 48],
  rating: [4.5, 4.6, 4.5, 4.7, 4.6, 4.8, 4.7, 4.8, 4.7, 4.9, 4.8, 4.8],
};

const LIVE_INTERPRETERS = [
  { id: 'I1', name: 'Ahmad Khan', pair: 'Arabic → English', status: 'online', call: 'Medical Consultation', type: 'audio', duration: '12:24', client: 'Client #C9821', earning: '$6.00', rate: '($0.50/min)' },
  { id: 'I2', name: 'Sarah M.', pair: 'Arabic → English', status: 'idle', call: '—', type: null, duration: '—', client: '—', earning: '—', rate: '' },
  { id: 'I3', name: 'Faisal R.', pair: 'French → English', status: 'online', call: 'Legal Discussion', type: 'audio', duration: '18:47', client: 'Client #C6712', earning: '$9.00', rate: '($0.50/min)' },
  { id: 'I4', name: 'Maria L.', pair: 'Spanish → English', status: 'available', call: 'Ready to accept', type: null, duration: '—', client: '—', earning: '—', rate: '' },
  { id: 'I5', name: 'Omar H.', pair: 'Urdu → English', status: 'offline', call: '—', type: null, duration: '—', client: '—', earning: '—', rate: '' },
];

const RECENT_SESSIONS = [
  { type: 'audio', name: 'Medical Consultation', pair: 'Arabic → English', client: 'Client #C9821', time: 'Today, 6:10 PM', dur: '22 min', earned: '$19.80', int: '$9.90 (Int.)' },
  { type: 'video', name: 'Legal Discussion', pair: 'French → English', client: 'Client #C6712', time: 'Today, 5:40 PM', dur: '35 min', earned: '$42.00', int: '$17.50 (Int.)' },
  { type: 'audio', name: 'Immigration Help', pair: 'Spanish → English', client: 'Client #C5521', time: 'Today, 5:15 PM', dur: '18 min', earned: '$16.20', int: '$8.10 (Int.)' },
  { type: null, name: 'General Inquiry', pair: 'Arabic → English', client: 'Client #C3310', time: 'Today, 4:50 PM', dur: '—', earned: '$0.00', int: '$0.00 (Int.)' },
  { type: 'audio', name: 'Business Meeting', pair: 'Arabic → English', client: 'Client #C1290', time: 'Today, 4:20 PM', dur: '27 min', earned: '$24.30', int: '$12.15 (Int.)' },
];

const INITIAL_PAYOUTS = [
  { name: 'Ahmed K.', amount: '$72.50' },
  { name: 'Maria L.', amount: '$65.00' },
  { name: 'Faisal R.', amount: '$58.20' },
  { name: 'Sarah M.', amount: '$50.30' },
];

const TOP_INTERPS = [
  { rank: 1, name: 'Ahmed Khan', rating: 4.9, calls: 128, rankColor: '#fbbf24' },
  { rank: 2, name: 'Sarah M.', rating: 4.8, calls: 112, rankColor: '#94a3b8' },
  { rank: 3, name: 'Faisal R.', rating: 4.7, calls: 98, rankColor: '#cd7c3a' },
  { rank: 4, name: 'Maria L.', rating: 4.7, calls: 89, rankColor: '#6366f1' },
  { rank: 5, name: 'Omar H.', rating: 4.6, calls: 76, rankColor: '#6366f1' },
];

const ACTIVITY = [
  { icon: '💰', text: 'Payout request from Ahmed K.', meta: '$72.50', time: '10 min ago', c: '#f59e0b' },
  { icon: '👤', text: 'New interpreter registered', meta: 'John D.', time: '25 min ago', c: '#6366f1' },
  { icon: '📞', text: 'Call completed', meta: 'Medical Consultation', time: '32 min ago', c: '#10b981' },
  { icon: '⭐', text: 'New feedback received', meta: 'Sarah M. ★5', time: '45 min ago', c: '#fbbf24' },
  { icon: '🔴', text: 'Interpreter Faisal R. went offline', meta: '', time: '1 hr ago', c: '#ef4444' },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <IC.Dashboard /> },
  { id: 'live', label: 'Live monitor', icon: <IC.Radio /> },
  { id: 'interps', label: 'Interpreters', icon: <IC.Users /> },
  { id: 'sessions', label: 'Sessions & calls', icon: <IC.Phone /> },
  { id: 'payments', label: 'Payments & earnings', icon: <IC.Dollar />, chevron: true },
  { id: 'payouts', label: 'Payout requests', icon: <IC.Download />, badge: 8 },
  { id: 'feedback', label: 'Feedback & ratings', icon: <IC.Star /> },
  { id: 'disputes', label: 'Disputes', icon: <IC.AlertCircle />, badge: 2 },
  { id: 'reports', label: 'Reports', icon: <IC.BarChart />, chevron: true },
  { id: 'settings', label: 'Settings', icon: <IC.Settings />, chevron: true },
];

const SECTION_MAP = {
  dashboard: 'metrics-grid',
  live: 'live-monitor',
  interps: 'top-interpreters',
  sessions: 'recent-sessions',
  payments: 'earnings-overview',
  payouts: 'payout-requests',
  feedback: 'top-interpreters',
  reports: 'earnings-overview',
};

/* ─────────────────────────────────────────────
   SHARED STYLE HELPERS
───────────────────────────────────────────── */
const card = {
  background: '#0d1526',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  overflow: 'hidden',
};
const cardHdr = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
};
const cardTitle = { fontSize: 14, fontWeight: 700, color: 'white' };
const viewAllBtn = {
  fontSize: 12,
  fontWeight: 600,
  color: '#6366f1',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
};
const TH = {
  fontSize: 11,
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  padding: '9px 14px',
  textAlign: 'left',
  background: 'rgba(0,0,0,0.15)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};
const TD = {
  padding: '9px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  fontSize: 12,
  color: '#94a3b8',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AdminDashboard({ user }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [exporting, setExporting] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Jul 01 – Jul 31, 2025');
  const [toast, setToast] = useState(null);
  const [watching, setWatching] = useState(null);

  const notifRef = useRef();
  const userRef = useRef();
  const dateRef = useRef();

  const _user = user ?? { name: 'Admin User', initials: 'AU', role: 'Super Admin' };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  /* ── click outside to close dropdowns ── */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── toast helper ── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── nav click: switch + scroll ── */
  const handleNavClick = (id) => {
    setActiveNav(id);
    const sectionId = SECTION_MAP[id];
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToast(`${id} section coming soon`);
    }
  };

  /* ── export mock ── */
  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      showToast('Report exported successfully');
    }, 1200);
  };

  /* ── payout actions ── */
  const approvePayout = (name) => {
    setPayouts((prev) => prev.filter((p) => p.name !== name));
    showToast(`Approved payout for ${name}`);
  };
  const rejectPayout = (name) => {
    setPayouts((prev) => prev.filter((p) => p.name !== name));
    showToast(`Rejected payout for ${name}`);
  };

  /* ── live monitor actions ── */
  const viewDetails = (interp) => showToast(`Opening details for ${interp.name}`);
  const monitorCall = (interp) => {
    setWatching(interp.id);
    showToast(`Monitoring ${interp.name}'s call`);
  };

  /* ── date presets ── */
  const datePresets = ['Jul 01 – Jul 31, 2025', 'Jun 01 – Jun 30, 2025', 'Last 7 days', 'Today'];
  const pickDate = (range) => {
    setDateRange(range);
    setDateOpen(false);
    showToast(`Date range: ${range}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#080d1a',
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        fontSize: 13,
        color: '#e2e8f0',
      }}
    >
      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        style={{
          width: 212,
          minWidth: 212,
          display: 'flex',
          flexDirection: 'column',
          background: '#0d1526',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            height: 58,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#6366f1,#22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IC.Globe />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            LingoBridge
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: 'rgba(99,102,241,0.2)',
              color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 4,
              padding: '2px 6px',
              marginLeft: 'auto',
            }}
          >
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'inherit',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? 'white' : '#64748b',
                  transition: 'all 0.15s',
                  position: 'relative',
                  marginBottom: 1,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '22%',
                      bottom: '22%',
                      width: 3,
                      background: '#6366f1',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span style={{ color: active ? '#818cf8' : '#475569', flexShrink: 0, display: 'flex' }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: '#6366f1',
                      color: 'white',
                      borderRadius: 999,
                      padding: '1px 6px',
                      minWidth: 18,
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.chevron && (
                  <span style={{ color: '#334155', display: 'flex' }}>
                    <IC.ChevronDown />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System status */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              System status
            </span>
          </div>
          <p style={{ fontSize: 11, color: '#10b981', marginBottom: 8, fontWeight: 600 }}>
            All systems operational
          </p>
          {[
            ['Live calls', '23'],
            ['Online interpreters', '48'],
            ['Clients online', '57'],
            ['Active sessions', '19'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>{k}</span>
              <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => showToast('Opening system logs…')}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '7px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            View system logs
          </button>
        </div>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Avatar initials={_user.initials} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{_user.name}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>{_user.role}</p>
          </div>
          <button
            type="button"
            onClick={() => showToast('User menu')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
          >
            <IC.MoreVertical />
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(13,21,38,0.9)',
            backdropFilter: 'blur(12px)',
            flexShrink: 0,
            height: 58,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {greeting}, {_user.name.split(' ')[0]} 👋
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
              Here's what's happening on LingoBridge today.
            </div>
          </div>

          {/* Date range */}
          <div style={{ position: 'relative' }} ref={dateRef}>
            <button
              type="button"
              onClick={() => setDateOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <IC.Calendar /> {dateRange} <IC.ChevronDown />
            </button>
            {dateOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  left: 0,
                  width: 220,
                  background: '#0d1526',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 6,
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                {datePresets.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => pickDate(r)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: dateRange === r ? 'rgba(99,102,241,0.15)' : 'transparent',
                      color: dateRange === r ? 'white' : '#94a3b8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <IC.Download /> {exporting ? 'Exporting…' : 'Export'}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              style={{
                position: 'relative',
                width: 34,
                height: 34,
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
                flexShrink: 0,
              }}
            >
              <IC.Bell />
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(99,102,241,0.5)',
                }}
              >
                3
              </span>
            </button>

            {notifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 300,
                  background: '#0d1526',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '6px 0',
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'white',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  Notifications
                </div>
                {[
                  { t: 'New payout request from Ahmed K.', m: '10 min ago' },
                  { t: 'Interpreter Sarah M. rated 5★', m: '25 min ago' },
                  { t: 'System backup completed', m: '1 hr ago' },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      showToast(n.t);
                      setNotifOpen(false);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{n.t}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{n.m}</div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    showToast('All notifications marked read');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#6366f1',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div style={{ position: 'relative' }} ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <Avatar initials={_user.initials} size={34} />
            </button>
            {userOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 180,
                  background: '#0d1526',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 6,
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                {['Profile', 'Account settings', 'Logout'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setUserOpen(false);
                      showToast(`${item} clicked`);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* ── 6 Metric cards ── */}
          <div
            id="metrics-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}
          >
            {[
              { label: 'Total Revenue', value: '$12,846.90', delta: '+12.5% vs Jun 01 – Jun 30', up: true, spark: SPARKDATA.revenue, color: '#6366f1' },
              { label: 'Platform Profit', value: '$7,284.40', delta: '+10.3% vs Jun 01 – Jun 30', up: true, spark: SPARKDATA.profit, color: '#818cf8' },
              { label: 'Total Sessions', value: '1,245', delta: '+8.6% vs Jun 01 – Jun 30', up: true, spark: SPARKDATA.sessions, color: '#22d3ee' },
              { label: 'Active Calls (Live)', value: '19', delta: '🟢 Live now', live: true, spark: SPARKDATA.active, color: '#10b981' },
              { label: 'Online Interpreters', value: '48 / 132', delta: '36% of total', neutral: true, spark: SPARKDATA.interpreters, color: '#f59e0b' },
              { label: 'Avg. Rating', value: '4.8 ⭐', delta: '+0.2 vs last month', up: true, spark: SPARKDATA.rating, color: '#fbbf24' },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  background: '#0d1526',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '14px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                    }}
                  >
                    {m.label}
                  </span>
                  <span style={{ color: '#334155', cursor: 'pointer' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '-0.03em',
                    fontFamily: "'JetBrains Mono',monospace",
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: m.live ? '#10b981' : m.neutral ? '#94a3b8' : m.up ? '#34d399' : '#f87171',
                  }}
                >
                  {m.delta}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Sparkline color={m.color} data={m.spark} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Live monitor ── */}
          <div id="live-monitor" style={card}>
            <div style={cardHdr}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={cardTitle}>Live monitor</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    color: '#34d399',
                    borderRadius: 999,
                    padding: '2px 9px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 5px #10b981',
                    }}
                  />
                  Live
                </span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Showing all live sessions')}
                style={viewAllBtn}
              >
                View all live sessions
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Interpreter', 'Status', 'Current call', 'Type', 'Duration', 'Client', 'Earnings (Live)', 'Actions'].map((h) => (
                      <th key={h} style={TH}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIVE_INTERPRETERS.map((interp) => (
                    <tr
                      key={interp.id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={TD}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar
                            initials={interp.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                            size={28}
                          />
                          <div>
                            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>{interp.name}</div>
                            <div style={{ color: '#475569', fontSize: 11 }}>{interp.pair}</div>
                          </div>
                        </div>
                      </td>
                      <td style={TD}>
                        <StatusDot status={interp.status} />
                      </td>
                      <td
                        style={{
                          ...TD,
                          color: interp.call === '—' ? '#334155' : '#e2e8f0',
                          fontWeight: interp.call !== '—' ? 500 : 400,
                        }}
                      >
                        {interp.call}
                      </td>
                      <td style={TD}>
                        {interp.type ? (
                          <span style={{ color: interp.type === 'video' ? '#818cf8' : '#34d399', display: 'flex' }}>
                            {interp.type === 'video' ? <IC.VideoIcon /> : <IC.PhoneSmall />}
                          </span>
                        ) : (
                          <span style={{ color: '#334155' }}>—</span>
                        )}
                      </td>
                      <td
                        style={{
                          ...TD,
                          fontFamily: "'JetBrains Mono',monospace",
                          color: interp.duration !== '—' ? '#e2e8f0' : '#334155',
                        }}
                      >
                        {interp.duration}
                      </td>
                      <td style={{ ...TD, color: interp.client !== '—' ? '#94a3b8' : '#334155' }}>
                        {interp.client}
                      </td>
                      <td style={TD}>
                        {interp.earning !== '—' ? (
                          <div>
                            <div
                              style={{
                                color: '#34d399',
                                fontWeight: 700,
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 12,
                              }}
                            >
                              {interp.earning}
                            </div>
                            <div style={{ color: '#475569', fontSize: 11 }}>{interp.rate}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#334155' }}>—</span>
                        )}
                      </td>
                      <td style={TD}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            type="button"
                            onClick={() => viewDetails(interp)}
                            title="View details"
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 7,
                              padding: '4px 7px',
                              cursor: 'pointer',
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IC.Eye />
                          </button>
                          <button
                            type="button"
                            onClick={() => monitorCall(interp)}
                            title="Monitor call"
                            style={{
                              background: watching === interp.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 7,
                              padding: '4px 7px',
                              cursor: 'pointer',
                              color: watching === interp.id ? '#818cf8' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IC.Monitor />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Middle row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Recent sessions */}
            <div id="recent-sessions" style={card}>
              <div style={cardHdr}>
                <span style={cardTitle}>Recent sessions</span>
                <button type="button" onClick={() => showToast('Viewing all sessions')} style={viewAllBtn}>
                  View all
                </button>
              </div>
              {RECENT_SESSIONS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        s.type === 'video'
                          ? 'rgba(99,102,241,0.15)'
                          : s.type === 'audio'
                          ? 'rgba(16,185,129,0.15)'
                          : 'rgba(239,68,68,0.15)',
                      color:
                        s.type === 'video' ? '#818cf8' : s.type === 'audio' ? '#34d399' : '#f87171',
                      border: `1px solid ${
                        s.type === 'video'
                          ? 'rgba(99,102,241,0.3)'
                          : s.type === 'audio'
                          ? 'rgba(16,185,129,0.3)'
                          : 'rgba(239,68,68,0.3)'
                      }`,
                    }}
                  >
                    {s.type === 'video' ? <IC.VideoIcon /> : s.type === 'audio' ? <IC.PhoneSmall /> : <IC.XSmall />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>{s.name}</div>
                    <div style={{ color: '#475569', fontSize: 11 }}>
                      {s.pair} · {s.client}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#64748b', fontSize: 11 }}>
                      {s.time} · {s.dur}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 72 }}>
                    <div
                      style={{
                        color: '#e2e8f0',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 12,
                      }}
                    >
                      {s.earned}
                    </div>
                    <div style={{ color: '#10b981', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
                      {s.int}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Earnings overview */}
            <div id="earnings-overview" style={card}>
              <div style={cardHdr}>
                <span style={cardTitle}>Earnings overview</span>
                <button type="button" onClick={() => showToast('Opening full report')} style={viewAllBtn}>
                  View full report
                </button>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    marginBottom: 14,
                    cursor: 'pointer',
                    color: '#e2e8f0',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  This month <IC.ChevronDown />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: 'white',
                      fontFamily: "'JetBrains Mono',monospace",
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    $12,846.90
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Total revenue</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <DonutChart segments={[{ pct: 43.3, color: '#6366f1' }, { pct: 56.7, color: '#10b981' }]} />
                  <div style={{ flex: 1 }}>
                    {[
                      { label: 'Interpreter Payouts', value: '$5,562.50', color: '#6366f1', note: '43.3%' },
                      { label: 'Platform Profit', value: '$7,284.40', color: '#10b981', note: '56.7%' },
                      { label: 'Profit Margin', value: '56.7%', color: null, note: null },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {row.color && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: row.color,
                                boxShadow: `0 0 5px ${row.color}`,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{row.label}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: '#e2e8f0',
                              fontFamily: "'JetBrains Mono',monospace",
                            }}
                          >
                            {row.value}
                          </span>
                          {row.note && <div style={{ fontSize: 11, color: '#475569' }}>{row.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {/* Payouts */}
            <div id="payout-requests" style={card}>
              <div style={cardHdr}>
                <span style={cardTitle}>Payout requests</span>
                <button type="button" onClick={() => showToast('Viewing all payouts')} style={viewAllBtn}>
                  View all
                </button>
              </div>
              {payouts.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar
                    initials={p.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                    size={30}
                  />
                  <span style={{ flex: 1, color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>{p.name}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontWeight: 700,
                      color: '#e2e8f0',
                      fontSize: 12,
                    }}
                  >
                    {p.amount}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => approvePayout(p.name)}
                      title="Approve"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: 6,
                        padding: '4px 6px',
                        cursor: 'pointer',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IC.Check />
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectPayout(p.name)}
                      title="Reject"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 6,
                        padding: '4px 6px',
                        cursor: 'pointer',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IC.X />
                    </button>
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  color: '#475569',
                  fontSize: 12,
                }}
              >
                <span>{payouts.length} requests pending</span>
                <IC.ChevronRight />
              </div>
            </div>

            {/* Top interpreters */}
            <div id="top-interpreters" style={card}>
              <div style={cardHdr}>
                <span style={cardTitle}>Top interpreters</span>
                <button type="button" onClick={() => showToast('Viewing all interpreters')} style={viewAllBtn}>
                  View all
                </button>
              </div>
              <div style={{ padding: '6px 0' }}>
                {TOP_INTERPS.map((interp) => (
                  <div
                    key={interp.rank}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: `${interp.rankColor}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: interp.rankColor,
                        flexShrink: 0,
                      }}
                    >
                      {interp.rank}
                    </div>
                    <Avatar
                      initials={interp.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                      size={28}
                    />
                    <span style={{ flex: 1, color: '#e2e8f0', fontWeight: 600, fontSize: 12 }}>
                      {interp.name}
                    </span>
                    <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>
                      ★ {interp.rating}
                    </span>
                    <span
                      style={{
                        color: '#475569',
                        fontSize: 11,
                        fontFamily: "'JetBrains Mono',monospace",
                        minWidth: 52,
                        textAlign: 'right',
                      }}
                    >
                      {interp.calls} calls
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div style={card}>
              <div style={cardHdr}>
                <span style={cardTitle}>Activity feed</span>
                <button type="button" onClick={() => showToast('Viewing all activity')} style={viewAllBtn}>
                  View all
                </button>
              </div>
              <div style={{ padding: '6px 0' }}>
                {ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 16px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        background: `${a.c}18`,
                        border: `1px solid ${a.c}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {a.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                        {a.text}
                        {a.meta && (
                          <span style={{ color: '#e2e8f0', fontWeight: 600, marginLeft: 4 }}>
                            {a.meta}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              marginTop: 4,
            }}
          >
            {[
              { icon: <IC.Shield />, title: 'Secure & compliant', sub: 'HIPAA compliant platform' },
              { icon: <IC.UserPlus />, title: 'Trusted by 3,000+ clients', sub: 'Across 40+ countries' },
              { icon: <IC.Clock />, title: '99.9% uptime', sub: 'Reliable & secure infrastructure' },
              { icon: <IC.Headphones />, title: '24/7 support', sub: 'Always here to help' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366f1',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* end scroll */}
      </div>
      {/* end main */}

      {/* ══════════ TOAST ══════════ */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: 'rgba(13,21,38,0.98)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 10,
            padding: '10px 20px',
            color: '#e2e8f0',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeUp 0.2s ease',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}