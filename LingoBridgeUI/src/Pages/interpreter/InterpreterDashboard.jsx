import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// All styles below are IDENTICAL to the original — not touched.
// ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base: #0d0f1a;
    --bg-panel: #141624;
    --bg-card: #1a1d2e;
    --bg-hover: #1e2235;
    --bg-active: #252a40;
    --border: #252a40;
    --border-light: #2e3350;
    --text-primary: #e8eaf6;
    --text-secondary: #8b90b0;
    --text-muted: #5a5f7a;
    --accent-purple: #7c5cfc;
    --accent-purple-light: #9d80ff;
    --accent-purple-dim: rgba(124,92,252,0.15);
    --accent-green: #22c55e;
    --accent-green-dim: rgba(34,197,94,0.15);
    --accent-red: #ef4444;
    --accent-red-dim: rgba(239,68,68,0.12);
    --accent-blue: #3b82f6;
    --accent-gold: #f59e0b;
    --accent-teal: #14b8a6;
    --sidebar-width: 220px;
    --font: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html, body {
    font-family: var(--font);
    background: var(--bg-base);
    color: var(--text-primary);
    height: 100%;
    overflow: auto;
  }

  .dashboard-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg-base);
    font-family: var(--font);
  }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-width);
    background: var(--bg-panel);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 22px 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo-icon {
    width: 34px; height: 34px;
    background: var(--accent-purple);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .logo-text {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.15s;
    position: relative;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
  .nav-item.active { background: var(--accent-purple-dim); color: var(--text-primary); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .nav-badge {
    margin-left: auto;
    background: var(--accent-purple);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: 10px;
    font-family: var(--font-mono);
  }

  .sidebar-bottom {
    padding: 14px 10px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .refer-card {
    margin: 0 10px 12px;
    background: linear-gradient(135deg, #2a1f5e, #1a1d2e);
    border: 1px solid #3d2fa0;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .refer-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .refer-headphone { font-size: 20px; }

  .refer-sub {
    font-size: 11.5px;
    color: var(--text-secondary);
    line-height: 1.4;
    margin-top: 2px;
  }

  .refer-btn {
    margin-top: 10px;
    background: var(--accent-purple);
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 7px 0;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    font-family: var(--font);
    transition: background 0.15s;
  }

  .refer-btn:hover { background: var(--accent-purple-light); }

  /* MAIN */
  .main-area {
    margin-left: var(--sidebar-width);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* TOPBAR */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 28px 0;
  }

  .topbar-greeting h1 {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
  }

  .topbar-greeting p {
    font-size: 13.5px;
    color: var(--text-secondary);
    margin-top: 3px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .status-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent-green);
    box-shadow: 0 0 6px var(--accent-green);
  }

  .notif-btn {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 50%;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: var(--text-secondary);
    transition: all 0.15s;
  }

  .notif-btn:hover { border-color: var(--accent-purple); color: var(--text-primary); }

  .notif-count {
    position: absolute;
    top: -4px; right: -4px;
    background: var(--accent-purple);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 16px; height: 16px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
  }

  .avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #7c5cfc, #a78bfa);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
  }

  /* CONTENT GRID */
  .content {
    padding: 22px 28px 28px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    flex: 1;
    align-items: start;
  }

  .left-col { display: flex; flex-direction: column; gap: 18px; }
  .right-col { display: flex; flex-direction: column; gap: 18px; }

  /* STAT CARDS */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 10px;
  }

  .stat-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  .stat-icon.green { background: var(--accent-green-dim); }
  .stat-icon.blue { background: rgba(59,130,246,0.15); }
  .stat-icon.gold { background: rgba(245,158,11,0.15); }
  .stat-icon.purple { background: var(--accent-purple-dim); }

  .stat-value {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-stars { display: flex; gap: 2px; font-size: 13px; margin-bottom: 4px; }
  .stat-change { font-size: 12px; color: var(--accent-green); font-weight: 500; }
  .stat-sub { font-size: 12px; color: var(--text-muted); }
  .stat-payout { font-size: 12px; color: var(--accent-green); font-weight: 500; }

  /* PANEL */
  .panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px 12px;
    border-bottom: 1px solid var(--border);
  }

  .panel-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-badge {
    background: var(--accent-purple);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    font-family: var(--font-mono);
  }

  .view-all {
    font-size: 13px;
    color: var(--accent-purple-light);
    cursor: pointer;
    font-weight: 500;
    background: none;
    border: none;
    font-family: var(--font);
  }

  .view-all:hover { text-decoration: underline; }

  /* INCOMING REQUEST */
  .incoming-featured {
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .req-avatar {
    width: 46px; height: 46px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .req-info { flex: 1; }

  .req-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }

  .req-subtitle { font-size: 12.5px; color: var(--text-secondary); margin-top: 1px; }

  .req-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .tag.lang { background: var(--bg-hover); border: 1px solid var(--border-light); color: var(--text-secondary); }
  .tag.category-medical { background: rgba(245,158,11,0.15); color: #f59e0b; }
  .tag.video { background: var(--accent-purple-dim); color: var(--accent-purple-light); }
  .tag.audio { background: rgba(34,197,94,0.12); color: var(--accent-green); }
  .tag.time { background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-light); }

  .req-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }

  .btn-accept {
    background: var(--accent-green-dim);
    border: 1.5px solid var(--accent-green);
    color: var(--accent-green);
    border-radius: 8px;
    padding: 10px 28px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font);
    display: flex; align-items: center; gap: 6px;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .btn-accept:hover { background: var(--accent-green); color: #fff; }

  .btn-decline {
    background: var(--accent-red-dim);
    border: 1.5px solid var(--accent-red);
    color: var(--accent-red);
    border-radius: 8px;
    padding: 10px 28px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font);
    display: flex; align-items: center; gap: 6px;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .btn-decline:hover { background: var(--accent-red); color: #fff; }

  .call-icon-btn {
    width: 42px; height: 42px;
    border-radius: 50%;
    background: var(--accent-purple-dim);
    border: 1.5px solid var(--accent-purple);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .call-icon-btn:hover { background: var(--accent-purple); }

  /* MINI REQUEST ROW */
  .req-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    transition: background 0.12s;
  }

  .req-row:last-child { border-bottom: none; }
  .req-row:hover { background: var(--bg-hover); }

  .mini-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .mini-info { flex: 1; }
  .mini-name { font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
  .mini-type { font-size: 12px; color: var(--text-secondary); }

  .mini-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .mini-actions { display: flex; gap: 6px; }

  .mini-btn {
    width: 30px; height: 30px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 14px;
    border: none;
    transition: all 0.12s;
  }

  .mini-btn.accept { background: var(--accent-green-dim); border: 1px solid var(--accent-green); color: var(--accent-green); }
  .mini-btn.accept:hover { background: var(--accent-green); color: #fff; }
  .mini-btn.decline { background: var(--accent-red-dim); border: 1px solid var(--accent-red); color: var(--accent-red); }
  .mini-btn.decline:hover { background: var(--accent-red); color: #fff; }

  /* RECENT SESSIONS */
  .session-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    transition: background 0.12s;
  }

  .session-row:last-child { border-bottom: none; }
  .session-row:hover { background: var(--bg-hover); }

  .session-status {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }

  .session-status.done { background: var(--accent-green-dim); color: var(--accent-green); }
  .session-status.missed { background: var(--accent-red-dim); color: var(--accent-red); }

  .session-name { font-weight: 600; color: var(--text-primary); min-width: 70px; }
  .session-type { color: var(--text-secondary); min-width: 130px; }
  .session-lang { color: var(--text-secondary); min-width: 130px; }

  .session-call-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    min-width: 90px;
  }

  .session-dur { color: var(--text-muted); min-width: 50px; }

  .session-earn {
    margin-left: auto;
    font-weight: 600;
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .session-earn.positive { color: var(--accent-green); }
  .session-earn.zero { color: var(--accent-red); }

  /* AVAILABILITY */
  .avail-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 16px 18px;
  }

  .avail-slot {
    background: var(--bg-hover);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 10px 6px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .avail-slot.available { border-color: var(--accent-green); background: var(--accent-green-dim); }
  .avail-slot.busy { border-color: var(--accent-red); background: var(--accent-red-dim); }
  .avail-slot.offline { border-color: var(--border-light); background: var(--bg-hover); }

  .avail-time {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 11.5px;
    margin-bottom: 5px;
    white-space: nowrap;
  }

  .avail-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 11px;
  }

  .avail-dot { width: 6px; height: 6px; border-radius: 50%; }
  .avail-dot.green { background: var(--accent-green); }
  .avail-dot.red { background: var(--accent-red); }
  .avail-dot.gray { background: var(--text-muted); }

  /* RIGHT COLUMN */
  .rates-body { padding: 14px 18px; }

  .rate-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }

  .rate-row:last-of-type { border-bottom: none; }

  .rate-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: var(--text-primary);
  }

  .rate-val { font-size: 14px; font-weight: 600; color: var(--accent-green); font-family: var(--font-mono); }
  .rate-unit { font-size: 12px; color: var(--text-muted); font-weight: 400; }
  .rates-note { font-size: 12px; color: var(--text-muted); margin-top: 10px; }

  /* BOOKINGS */
  .booking-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid var(--border);
    transition: background 0.12s;
  }

  .booking-row:last-child { border-bottom: none; }
  .booking-row:hover { background: var(--bg-hover); }

  .booking-date {
    background: var(--bg-hover);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 6px 8px;
    text-align: center;
    min-width: 46px;
    flex-shrink: 0;
  }

  .booking-day { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1; }
  .booking-month { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .booking-time { font-size: 12.5px; font-weight: 600; color: var(--accent-blue); min-width: 60px; font-family: var(--font-mono); }
  .booking-info { flex: 1; }
  .booking-client { font-size: 13.5px; font-weight: 600; color: var(--text-primary); }
  .booking-detail { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }

  .duration-pill {
    background: var(--bg-hover);
    border: 1px solid var(--border-light);
    border-radius: 6px;
    padding: 3px 9px;
    font-size: 11.5px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    white-space: nowrap;
  }

  /* PAYOUTS */
  .payout-body { padding: 16px 18px; }
  .payout-available-label { font-size: 12.5px; color: var(--text-secondary); margin-bottom: 4px; }

  .payout-amount {
    font-size: 28px;
    font-weight: 700;
    color: var(--accent-green);
    font-family: var(--font-mono);
    letter-spacing: -0.5px;
    margin-bottom: 12px;
  }

  .btn-payout {
    width: 100%;
    background: var(--accent-purple);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font);
    transition: background 0.15s;
  }

  .btn-payout:hover { background: var(--accent-purple-light); }

  .payout-min-note { font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 6px; }
  .payout-history-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 16px; margin-bottom: 10px; }

  .payout-hist-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }

  .payout-hist-row:last-of-type { border-bottom: none; }
  .payout-hist-date { color: var(--text-secondary); }
  .payout-hist-amount { font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); }

  .paid-badge {
    background: var(--accent-green-dim);
    color: var(--accent-green);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 5px;
  }

  .view-history {
    display: block;
    text-align: center;
    margin-top: 12px;
    font-size: 13px;
    color: var(--accent-purple-light);
    cursor: pointer;
    font-weight: 500;
  }

  .view-history:hover { text-decoration: underline; }
`;

// ─────────────────────────────────────────────────────────────────
// STATIC DATA (unchanged from original)
// ─────────────────────────────────────────────────────────────────
const navItems = [
  { icon: "🏠", label: "Dashboard", active: true },
  { icon: "📞", label: "Incoming Requests", badge: 3 },
  { icon: "📅", label: "Upcoming Bookings" },
  { icon: "🕐", label: "My Sessions" },
  { icon: "💰", label: "Earnings" },
  { icon: "💸", label: "Payouts" },
  { icon: "🕓", label: "Availability" },
  { icon: "👤", label: "Profile" },
  { icon: "⚙️", label: "Settings" },
  { icon: "❓", label: "Help & Support" },
];

const bottomNavItems = [
  { icon: "↪️", label: "Logout" },
];

const bookings = [
  { day: "25", month: "APR", time: "9:00 AM", client: "Clinic ABC", detail: "Arabic → English • Video call", duration: "30 min" },
  { day: "25", month: "APR", time: "11:30 AM", client: "Legal Aid Bureau", detail: "Arabic → English • Audio call", duration: "1 hr" },
  { day: "25", month: "APR", time: "2:00 PM", client: "Global Solutions Inc.", detail: "English → Spanish • Video call", duration: "45 min" },
];

const sessions = [
  { status: "done", name: "Maria L.", type: "Medical Consultation", lang: "Spanish → English", callType: "video", duration: "28 min", earn: "$14.00" },
  { status: "done", name: "Ahmed K.", type: "Legal Discussion", lang: "Arabic → English", callType: "audio", duration: "42 min", earn: "$18.90" },
  { status: "missed", name: "Missed call", type: "Business Inquiry", lang: "English → Arabic", callType: "video", duration: "—", earn: "$0.00" },
];

const availability = [
  { time: "8–10 AM", status: "available" },
  { time: "10–12 PM", status: "available" },
  { time: "12–2 PM", status: "busy" },
  { time: "2–4 PM", status: "available" },
  { time: "4–6 PM", status: "available" },
  { time: "6–8 PM", status: "offline" },
];

const payoutHistory = [
  { date: "Apr 10, 2025", amount: "$120.00" },
  { date: "Mar 28, 2025", amount: "$110.50" },
  { date: "Mar 15, 2025", amount: "$95.00" },
];

const avatarColors = ["#7c5cfc", "#3b82f6", "#14b8a6", "#f59e0b", "#ef4444"];

// ─────────────────────────────────────────────────────────────────
// INITIAL REQUESTS — converted from hardcoded JSX into a data array
// so useState can manage them. Shape matches what the UI needs.
// ─────────────────────────────────────────────────────────────────
const INITIAL_REQUESTS = [
  {
    id: "req-1",
    isFeatured: true,
    initial: "S",
    avatarColor: avatarColors[0],
    name: "Sarah M.",
    subtitle: "Requesting right now",
    tags: [
      { cls: "lang",             label: "🌐 Arabic → English" },
      { cls: "category-medical", label: "🔥 Medical"          },
      { cls: "video",            label: "📹 Video call"        },
      { cls: "time",             label: "⏱ ~30 min"           },
    ],
    bookingPayload: { id: "req-1", language: "Arabic", sessionType: "video", purpose: "Medical" },
  },
  {
    id: "req-2",
    isFeatured: false,
    initial: "D",
    avatarColor: avatarColors[1],
    name: "David R.",
    type: "Legal Consultation",
    metaLang: "English → Spanish",
    metaCallTag: { cls: "audio", label: "📞 Audio call" },
    metaTime: "⏱ ~20 min",
    bookingPayload: { id: "req-2", language: "Spanish", sessionType: "audio", purpose: "Legal" },
  },
  {
    id: "req-3",
    isFeatured: false,
    initial: "L",
    avatarColor: avatarColors[2],
    name: "Laura K.",
    type: "Business Meeting",
    metaLang: "French → English",
    metaCallTag: { cls: "video", label: "📹 Video call" },
    metaTime: "⏱ ~45 min",
    bookingPayload: { id: "req-3", language: "French", sessionType: "video", purpose: "Business" },
  },
];

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// Props:
//   user        — { name, initials, role }
//   onCallStart — (bookingPayload) => void  (wired to Agora in App.jsx)
//   socket      — optional socket.io-client instance (may be null)
// ─────────────────────────────────────────────────────────────────
export default function InterpreterDashboard({ user, onCallStart, socket }) {
  const [activeNav, setActiveNav] = useState("Dashboard");

  // ── REQUESTS STATE ───────────────────────────────────────────
  // Converted from hardcoded JSX to stateful array so accept/decline work.
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  // ── OPTIONAL SOCKET LISTENERS ────────────────────────────────
  // Safe: only runs when a real socket is passed in.
  // Does NOT break the app when socket is null or undefined.
  useEffect(() => {
    if (!socket) return;

    const register = () => {
      console.log('🟢 Interpreter registering...');
      socket.emit('register', { role: 'interpreter' });
    };

    if (socket.connected) {
      register();
    } else {
      socket.on('connect', register);
    }

    const handleIncoming = (data) => {
      console.log('📞 Incoming request received:', data);
      const newReq = {
        id:           data.roomId || `socket-${Date.now()}`,
        isFeatured:   true,
        initial:      (data.clientName || 'C').charAt(0).toUpperCase(),
        avatarColor:  avatarColors[Math.floor(Math.random() * avatarColors.length)],
        name:         data.clientName || 'Client',
        subtitle:     'Requesting right now',
        tags: [
          { cls: 'lang',  label: `🌐 ${data.language || 'Unknown'}` },
          { cls: data.type === 'video' ? 'video' : 'audio',
            label: data.type === 'video' ? '📹 Video call' : '📞 Audio call' },
          { cls: 'time',  label: `⏱ ${data.duration || '~30 min'}` },
        ],
        bookingPayload: {
          id:          data.roomId,
          language:    data.language,
          sessionType: data.type,
          purpose:     data.purpose,
          roomId:      data.roomId,
        },
      };
      setRequests(prev => [
        newReq,
        ...prev.map(r => ({ ...r, isFeatured: false })),
      ]);
    };

    const handleCancelled = ({ id }) => {
      setRequests(prev => prev.filter(r => r.id !== id));
    };

    socket.on('incoming-request', handleIncoming);
    socket.on('request-cancelled', handleCancelled);

    return () => {
      socket.off('connect', register);
      socket.off('incoming-request', handleIncoming);
      socket.off('request-cancelled', handleCancelled);
    };
  }, [socket]);

  // ── ACCEPT ───────────────────────────────────────────────────
  // Removes request from UI, then fires onCallStart with booking data.
 const handleAccept = (req) => {

  // ✅ Only call onCallStart — App.jsx owns all socket communication.
  // It will emit accept-call once. Previously this function was also
  // emitting accept-call directly, causing a double emit on the server.
  if (onCallStart) {
    onCallStart(req.bookingPayload);
    return;
  }

  setRequests(prev => prev.filter(r => r.id !== req.id));
};
  // Interpreter MUST also join the call — use onCallStart to enter Agora
  
  // ── DECLINE ──────────────────────────────────────────────────
  // Removes request from UI only — no call started.
  const handleDecline = (req) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  // Derived: split into featured (first) and mini rows (rest)
  const featuredRequest = requests.find((r) => r.isFeatured) || requests[0] || null;
  const miniRequests    = requests.filter((r) => r !== featuredRequest);
  const getMiniLang = (req) =>
    req.metaLang || req.tags?.find((tag) => tag.cls === "lang")?.label || "Unknown language";
  const getMiniCallTag = (req) =>
    req.metaCallTag ||
    req.tags?.find((tag) => tag.cls === "video" || tag.cls === "audio") ||
    { cls: "audio", label: "Call" };
  const getMiniTime = (req) =>
    req.metaTime || req.tags?.find((tag) => tag.cls === "time")?.label || "";

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-shell">

        {/* SIDEBAR — identical to original */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🌐</div>
            <span className="logo-text">LingoBridge</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                onClick={() => setActiveNav(item.label)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {/* Live badge reflects actual request count */}
                {item.label === "Incoming Requests"
                  ? requests.length > 0 && (
                      <span className="nav-badge">{requests.length}</span>
                    )
                  : item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )
                }
              </button>
            ))}
          </nav>
          <div className="refer-card">
            <div className="refer-header">
              <span className="refer-headphone">🎧</span>
              Refer &amp; Earn
            </div>
            <p className="refer-sub">Invite interpreters and earn rewards</p>
            <button className="refer-btn">Refer Now →</button>
          </div>
          <div className="sidebar-bottom">
            {bottomNavItems.map((item) => (
              <button key={item.label} className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN — identical layout to original */}
        <div className="main-area">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-greeting">
              <h1>Good evening, Ahmad 👋</h1>
              <p>You're online and ready to receive requests</p>
            </div>
            <div className="topbar-right">
              <div className="status-pill">
                <span className="status-dot" />
                Online
              </div>
              <div className="notif-btn">
                🔔
                <span className="notif-count">2</span>
              </div>
              <div className="avatar">AK</div>
            </div>
          </div>

          {/* Content */}
          <div className="content">
            <div className="left-col">

              {/* Stat Cards — unchanged */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon green">🛡️</div>
                    Sessions Today
                  </div>
                  <div className="stat-value">7</div>
                  <div className="stat-change">+2 from yesterday</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon blue">🕐</div>
                    Active Time
                  </div>
                  <div className="stat-value">4h 22m</div>
                  <div className="stat-change">+1h 10m from yesterday</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon gold">⭐</div>
                    Your Rating
                  </div>
                  <div className="stat-value">4.9</div>
                  <div className="stat-stars">⭐⭐⭐⭐⭐</div>
                  <div className="stat-sub">Based on 128 reviews</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon purple">💳</div>
                    Available Balance
                  </div>
                  <div className="stat-value">$48.50</div>
                  <div className="stat-payout">Payout available</div>
                </div>
              </div>

              {/* Incoming Requests Panel */}
              <div className="panel" style={{ border: "1.5px solid #3d2fa0" }}>
                <div className="panel-header">
                  <span className="panel-title">
                    Incoming Request{" "}
                    {requests.length > 0 && (
                      <span className="panel-badge">{requests.length}</span>
                    )}
                  </span>
                  <button className="view-all">View all</button>
                </div>

                {/* Empty state — shown only when all requests are dismissed */}
                {requests.length === 0 && (
                  <div style={{
                    padding: "28px 18px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}>
                    No incoming requests right now
                  </div>
                )}

                {/* Featured request — always the first in the list */}
                {featuredRequest && (
                  <div className="incoming-featured">
                    <div
                      className="req-avatar"
                      style={{ background: featuredRequest.avatarColor }}
                    >
                      {featuredRequest.initial}
                    </div>
                    <div className="req-info">
                      <div className="req-name">{featuredRequest.name}</div>
                      <div className="req-subtitle">
                        {featuredRequest.subtitle || "Requesting right now"}
                      </div>
                      <div className="req-tags">
                        {featuredRequest.tags.map((tag, i) => (
                          <span key={i} className={`tag ${tag.cls}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="call-icon-btn">📞</div>
                    <div className="req-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(featuredRequest)}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="btn-decline"
                        onClick={() => handleDecline(featuredRequest)}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini rows — all non-featured requests */}
                {miniRequests.map((req) => (
                  <div className="req-row" key={req.id}>
                    <div
                      className="mini-avatar"
                      style={{ background: req.avatarColor }}
                    >
                      {req.initial}
                    </div>
                    <div className="mini-info">
                      <div className="mini-name">{req.name}</div>
                      <div className="mini-type">{req.type}</div>
                    </div>
                    <div className="mini-meta">
                      <span>{getMiniLang(req)}</span>
                      <span
                        className={`tag ${getMiniCallTag(req).cls}`}
                        style={{ padding: "2px 8px" }}
                      >
                        {getMiniCallTag(req).label}
                      </span>
                      <span>{getMiniTime(req)}</span>
                    </div>
                    <div className="mini-actions">
                      <button
                        className="mini-btn accept"
                        onClick={() => handleAccept(req)}
                      >
                        ✓
                      </button>
                      <button
                        className="mini-btn decline"
                        onClick={() => handleDecline(req)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Sessions — unchanged */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Recent Sessions</span>
                  <button className="view-all">View all</button>
                </div>
                {sessions.map((s, i) => (
                  <div className="session-row" key={i}>
                    <div className={`session-status ${s.status}`}>
                      {s.status === "done" ? "✓" : "✕"}
                    </div>
                    <span className="session-name">{s.name}</span>
                    <span className="session-type">{s.type}</span>
                    <span className="session-lang">{s.lang}</span>
                    <span
                      className={`session-call-tag ${s.callType === "video" ? "tag video" : "tag audio"}`}
                      style={{ padding: "2px 8px", fontSize: 12 }}
                    >
                      {s.callType === "video" ? "📹 Video call" : "📞 Audio call"}
                    </span>
                    <span className="session-dur">{s.duration}</span>
                    <span className={`session-earn ${s.earn === "$0.00" ? "zero" : "positive"}`}>
                      {s.earn}
                    </span>
                  </div>
                ))}
              </div>

              {/* Availability — unchanged */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Availability Today</span>
                  <button className="view-all">Edit schedule</button>
                </div>
                <div className="avail-grid">
                  {availability.map((slot, i) => (
                    <div key={i} className={`avail-slot ${slot.status}`}>
                      <div className="avail-time">{slot.time}</div>
                      <div className="avail-label">
                        <span className={`avail-dot ${
                          slot.status === "available" ? "green" :
                          slot.status === "busy" ? "red" : "gray"
                        }`} />
                        <span style={{
                          color: slot.status === "available" ? "var(--accent-green)" :
                            slot.status === "busy" ? "var(--accent-red)" : "var(--text-muted)",
                          fontSize: 11,
                        }}>
                          {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — unchanged */}
            <div className="right-col">

              {/* Rates */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Your Rates</span>
                  <button className="view-all">Edit rates</button>
                </div>
                <div className="rates-body">
                  <div className="rate-row">
                    <span className="rate-label">📞 Audio call</span>
                    <span className="rate-val">$0.45<span className="rate-unit"> / min</span></span>
                  </div>
                  <div className="rate-row">
                    <span className="rate-label">📹 Video call</span>
                    <span className="rate-val">$0.50<span className="rate-unit"> / min</span></span>
                  </div>
                  <p className="rates-note">These are your earnings rates</p>
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Upcoming Bookings</span>
                  <button className="view-all">View all</button>
                </div>
                {bookings.map((b, i) => (
                  <div className="booking-row" key={i}>
                    <div className="booking-date">
                      <div className="booking-day">{b.day}</div>
                      <div className="booking-month">{b.month}</div>
                    </div>
                    <span className="booking-time">{b.time}</span>
                    <div className="booking-info">
                      <div className="booking-client">{b.client}</div>
                      <div className="booking-detail">{b.detail}</div>
                    </div>
                    <span className="duration-pill">{b.duration}</span>
                  </div>
                ))}
              </div>

              {/* Payouts */}
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Payouts</span>
                  <button className="view-all">View all</button>
                </div>
                <div className="payout-body">
                  <div className="payout-available-label">Available for payout</div>
                  <div className="payout-amount">$48.50</div>
                  <button className="btn-payout">Request Payout</button>
                  <p className="payout-min-note">Minimum payout: $50.00</p>
                  <div className="payout-history-title">Payout History</div>
                  {payoutHistory.map((h, i) => (
                    <div className="payout-hist-row" key={i}>
                      <span className="payout-hist-date">{h.date}</span>
                      <span className="payout-hist-amount">{h.amount}</span>
                      <span className="paid-badge">Paid</span>
                    </div>
                  ))}
                  <a className="view-history">View full history</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
