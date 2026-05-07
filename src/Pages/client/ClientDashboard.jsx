/**
 * ClientDashboard.jsx
 * LingoBridge — Client Booking & Dashboard
 *
 * ✅ SAFE: Pure UI component. Zero socket/Agora logic inside this file.
 * ✅ All call initiation routes through onConnectNow() / onSchedule() props.
 * ✅ socket prop REMOVED — was causing client to bypass App.jsx state management.
 *
 * FIX: BookingPage "Connect now" button previously did:
 *   if (socket) { socket.emit('new-request', ...) }   ← WRONG, bypassed App.jsx
 *   else { onConnectNow(bookingData) }                ← was never reached
 *
 * Now it always does:
 *   onConnectNow(bookingData)                         ← correct, goes through App.jsx
 */

import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  bg: "#0B0F1A",
  bg2: "#121826",
  bg3: "#1A2235",
  bg4: "#202A44",

  border: "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.1)",

  accent: "#7C5CFF",
  accentHover: "#6B4EFF",
  accentLight: "#9F84FF",
  accentDim: "rgba(124,92,255,0.12)",
  accentBorder: "rgba(124,92,255,0.35)",
  accentGlow: "rgba(124,92,255,0.5)",

  red: "#FF4D6D",
  redDim: "rgba(255,77,109,0.12)",
  redBorder: "rgba(255,77,109,0.35)",

  gold: "#F5C542",
  goldDim: "rgba(245,197,66,0.12)",

  blue: "#3BA4FF",
  blueDim: "rgba(59,164,255,0.12)",

  green: "#00E5A8",
  greenDim: "rgba(0,229,168,0.12)",
  greenBorder: "rgba(0,229,168,0.35)",

  t1: "#FFFFFF",
  t2: "#A0AEC0",
  t3: "#64748B",

  font: "'Inter', sans-serif",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lb-glass {
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(12px);
  }
  .lb-card-pro {
    transition: all 0.25s ease;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .lb-card-pro:hover {
    transform: translateY(-3px);
    border-color: rgba(124,92,255,0.4);
  }
  .lb-active-pro {
    border: 1px solid #7C5CFF !important;
    background: linear-gradient(135deg, rgba(124,92,255,0.15), rgba(124,92,255,0.05));
    box-shadow: 0 0 0 1px rgba(124,92,255,0.3), 0 10px 30px rgba(124,92,255,0.2);
  }
  .lb-green-pro {
    border: 1px solid #00E5A8 !important;
    background: rgba(0,229,168,0.1);
    box-shadow: 0 10px 25px rgba(0,229,168,0.2);
  }
  .lb-cta-pro {
    transition: all 0.25s ease;
  }
  .lb-cta-pro:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 15px 40px rgba(124,92,255,0.5);
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a3347; border-radius: 2px; }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseDot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
  }
  @keyframes connectGlow {
    0%, 100% { box-shadow: 0 4px 24px rgba(79,110,247,0.4); }
    50%       { box-shadow: 0 4px 40px rgba(79,110,247,0.7); }
  }
  .lb-connect-btn {
    animation: connectGlow 2.5s ease-in-out infinite;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .lb-connect-btn:hover { transform: translateY(-2px) !important; }
  .lb-nav-item { transition: all 0.12s; }
  .lb-nav-item:hover { color: #f1f5f9 !important; background: rgba(255,255,255,0.04) !important; }
  .lb-card-chip:hover { border-color: rgba(79,110,247,0.4) !important; background: rgba(79,110,247,0.06) !important; }
  .lb-toggle-btn { transition: all 0.15s; }
  .lb-toggle-btn:hover { opacity: 0.88; }
  .lb-purpose-btn { transition: all 0.15s; }
  .lb-purpose-btn:hover { border-color: rgba(79,110,247,0.4) !important; }
  .lb-dur-btn { transition: all 0.15s; }
  .lb-dur-btn:hover { border-color: rgba(79,110,247,0.5) !important; color: #f1f5f9 !important; }
  .lb-saved-card { transition: all 0.15s; }
  .lb-saved-card:hover { border-color: rgba(79,110,247,0.4) !important; }
  .lb-support-btn:hover { background: rgba(255,255,255,0.06) !important; }

  @keyframes ctaGlow {
    0%, 100% { box-shadow: 0 0 24px rgba(124,92,255,0.45), 0 4px 20px rgba(99,102,241,0.3); }
    50%       { box-shadow: 0 0 44px rgba(124,92,255,0.75), 0 8px 36px rgba(99,102,241,0.55); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(0,229,168,0.6); }
    50%       { opacity: 0.85; transform: scale(1.15); box-shadow: 0 0 0 5px rgba(0,229,168,0); }
  }
  .lb-session-card {
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.4,0,.2,1);
  }
  .lb-session-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  }
  .lb-when-card {
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.4,0,.2,1);
  }
  .lb-when-card:hover {
    transform: translateY(-2px);
  }
  .lb-purpose-card {
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.4,0,.2,1);
  }
  .lb-purpose-card:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
  }
  .lb-cta-main {
    animation: ctaGlow 2.8s ease-in-out infinite;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .lb-cta-main:hover {
    transform: translateY(-3px) scale(1.015) !important;
  }
  .lb-lang-select:focus {
    outline: none;
    border-color: rgba(124,92,255,0.5) !important;
    box-shadow: 0 0 0 3px rgba(124,92,255,0.15) !important;
  }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────
const DEFAULT_CLIENT = {
  name: "Ahmad Khan",
  initials: "AK",
  email: "ahmad.khan@email.com",
  walletBalance: 48.50,
};

const DEFAULT_CARDS = [
  { last4: "4242", expiry: "04/28", brand: "VISA",   isDefault: true  },
  { last4: "8888", expiry: "09/27", brand: "MC",     isDefault: false },
];

const DEFAULT_SESSIONS = [
  { id:1, language:"Arabic → English",   purpose:"Medical",    time:"Today, 6:10 PM",  duration:"42 min", status:"completed", cost:"$50.40" },
  { id:2, language:"French → English",   purpose:"Legal",      time:"Today, 4:30 PM",  duration:"28 min", status:"completed", cost:"$25.20" },
  { id:3, language:"Mandarin → English", purpose:"Business",   time:"Yesterday",        duration:"61 min", status:"completed", cost:"$73.20" },
  { id:4, language:"Spanish → English",  purpose:"Government", time:"Apr 22",           duration:"35 min", status:"completed", cost:"$31.50" },
  { id:5, language:"Arabic → English",   purpose:"Medical",    time:"Apr 20",           duration:"20 min", status:"missed",    cost:"—"      },
];

const LANGUAGES = [
  "Arabic","Spanish","French","Mandarin","Portuguese",
  "Russian","German","Japanese","Italian","Hindi","Turkish",
  "Dutch","Korean","Swedish","Vietnamese","Urdu",
];

const PURPOSES = [
  { id:"medical", icon:"❤️", label:"Medical", color:"#FF4D6D" },
  { id:"legal", icon:"⚖️", label:"Legal", color:"#F5C542" },
  { id:"business", icon:"💼", label:"Business", color:"#3BA4FF" },
  { id:"education", icon:"🎓", label:"Education", color:"#7C5CFF" },
  { id:"government", icon:"🏛️", label:"Government", color:"#7C5CFF" },
  { id:"other", icon:"💬", label:"Other", color:"#00E5A8" },
];

const DURATIONS = ["15 min", "30 min", "1 hour", "2+ hrs"];

const PURPOSE_ICONS = {
  Medical:"🏥", Legal:"⚖️", Business:"💼",
  Education:"🎓", Government:"🏛️", Other:"💬",
};

const NAV_ITEMS = [
  { id:"booking",   icon:"📋", label:"Book a session" },
  { id:"sessions",  icon:"🕐", label:"My sessions"    },
  { id:"payments",  icon:"💳", label:"Payments"       },
  { id:"favorites", icon:"🤍", label:"Favorites"      },
  { id:"profile",   icon:"👤", label:"Profile"        },
  { id:"settings",  icon:"⚙️",  label:"Settings"      },
  { id:"help",      icon:"❓", label:"Help & support" },
  { id:"logout",    icon:"🚪", label:"Logout"         },
];

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function Pill({ status }) {
  const map = {
    completed: { bg: C.greenDim,  color: C.green,  border: C.greenBorder,  label: "Completed" },
    missed:    { bg: C.redDim,    color: C.red,     border: C.redBorder,    label: "Missed"    },
    active:    { bg: C.accentDim, color: C.accent,  border: C.accentBorder, label: "Active"    },
    scheduled: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border:"rgba(245,158,11,0.3)", label:"Scheduled"},
    pending:   { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border:"rgba(245,158,11,0.3)", label:"Pending" },
  };
  const v = map[status] || { bg:"rgba(74,85,104,0.2)", color:C.t2, border:C.border, label:status };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:20,
      background:v.bg, border:`1px solid ${v.border}`,
      color:v.color, fontSize:11, fontWeight:600,
    }}>
      <span style={{width:5,height:5,borderRadius:"50%",background:"currentColor",display:"inline-block"}}/>
      {v.label}
    </span>
  );
}

function Avatar({ initials, size=34 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:"linear-gradient(135deg,#6366f1,#4f6ef7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.32, fontWeight:700, color:"#fff", flexShrink:0,
    }}>{initials}</div>
  );
}

function LiveDot({ color=C.green, size=7 }) {
  return (
    <span style={{
      display:"inline-block",
      width:size, height:size, borderRadius:"50%",
      background:color,
      animation:"pulseDot 2s ease-in-out infinite",
      boxShadow:`0 0 10px ${color}`,
      flexShrink:0,
    }}/>
  );
}

function Card({ children, style={}, padding=16 }) {
  return (
    <div style={{
      background:C.bg2, border:`1px solid ${C.border}`,
      borderRadius:12, padding, ...style,
    }}>
      {children}
    </div>
  );
}

function SH({ title, link, onLink }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <span style={{fontSize:14,fontWeight:700,color:C.t1}}>{title}</span>
      {link && <span onClick={onLink} style={{fontSize:12,color:C.accent,cursor:"pointer",fontWeight:500}}>{link}</span>}
    </div>
  );
}

function Sidebar({ activePage, onNav, client, onAddMoney, onAddCard, onChatSupport }) {
  return (
    <aside style={{
      width:220, flexShrink:0,
      background:C.bg2, borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column",
      height:"100%", overflowY:"auto",
    }}>
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"18px 16px 14px",
        borderBottom:`1px solid ${C.border}`,
        flexShrink:0,
      }}>
        <div style={{
          width:32, height:32, borderRadius:8,
          background:"linear-gradient(135deg,#6366f1,#4f6ef7)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:15,
        }}>🌐</div>
        <span style={{fontSize:15,fontWeight:700,color:C.t1}}>LingoBridge</span>
      </div>

      <nav style={{padding:"12px 8px 0"}}>
        {NAV_ITEMS.map(item => {
          const on = item.id === activePage;
          return (
            <div
              key={item.id}
              onClick={() => onNav(item.id)}
              className="lb-nav-item"
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"8px 10px", borderRadius:8, marginBottom:2,
                color: on ? C.t1 : C.t2,
                background: on
                  ? "linear-gradient(135deg, rgba(124,92,255,0.15), rgba(159,132,255,0.1))"
                  : "transparent",
                boxShadow: on ? `0 0 10px ${C.accentGlow}` : "none",
                border: `1px solid ${on ? C.accentBorder : "transparent"}`,
                cursor:"pointer", fontSize:12.5, fontWeight:500,
              }}
            >
              <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{padding:"14px 12px 0",marginTop:8}}>
        <div style={{
          background:C.bg3, border:`1px solid ${C.border}`,
          borderRadius:10, padding:14,
        }}>
          <div style={{fontSize:10,color:C.t3,letterSpacing:.5,marginBottom:4}}>Wallet balance</div>
          <div style={{fontSize:22,fontWeight:800,color:C.t1,marginBottom:10}}>
            ${client.walletBalance.toFixed(2)}
          </div>
          <button
            onClick={onAddMoney}
            style={{
              width:"100%", padding:"7px", borderRadius:6,
              background:C.accentDim, border:`1px solid ${C.accentBorder}`,
              color:C.accent, fontSize:11, fontWeight:600, cursor:"pointer",
              fontFamily:C.font,
            }}
          >+ Add money</button>
        </div>
      </div>

      <div style={{padding:"12px 12px 0"}}>
        <div style={{fontSize:10,color:C.t3,letterSpacing:.5,marginBottom:8}}>PAYMENT METHODS</div>
        {DEFAULT_CARDS.map((card,i) => (
          <div
            key={i}
            className="lb-card-chip"
            style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"8px 10px",
              background:C.bg3, border:`1px solid ${C.border}`,
              borderRadius:8, marginBottom:6, cursor:"pointer",
            }}
          >
            <span style={{
              fontSize:9, fontWeight:900, padding:"1px 4px",
              borderRadius:2,
              background: card.brand==="VISA" ? "#1a56db" : "#1e1e1e",
              color: "#fff",
            }}>{card.brand}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:C.t1}}>•••• {card.last4}</div>
              <div style={{fontSize:10,color:C.t3}}>Exp {card.expiry}</div>
            </div>
            <span style={{color:C.t3,fontSize:12}}>›</span>
          </div>
        ))}
        <button
          onClick={onAddCard}
          style={{
            width:"100%", padding:"7px", borderRadius:6,
            background:"transparent", border:`1px dashed ${C.border2}`,
            color:C.t2, fontSize:11, cursor:"pointer", fontFamily:C.font,
          }}
        >+ Add new card</button>
      </div>

      <div style={{padding:"12px",marginTop:"auto"}}>
        <div style={{
          background:C.bg3, border:`1px solid ${C.border}`,
          borderRadius:10, padding:12,
        }}>
          <div style={{fontSize:12,fontWeight:600,color:C.t1,marginBottom:3}}>Need help choosing?</div>
          <div style={{fontSize:10,color:C.t3,marginBottom:8}}>Our support team is here 24/7.</div>
          <button
            onClick={onChatSupport}
            className="lb-support-btn"
            style={{
              width:"100%", padding:"7px", borderRadius:6,
              background:C.bg2, border:`1px solid ${C.border}`,
              color:C.t1, fontSize:11, fontWeight:500, cursor:"pointer",
              fontFamily:C.font,
            }}
          >💬 Chat with support</button>
        </div>
      </div>

      <div style={{padding:"0 12px 12px"}}>
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          padding:10, background:C.bg3, borderRadius:8,
        }}>
          <Avatar initials={client.initials} />
          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{client.name}</div>
            <div style={{fontSize:10,color:C.t3}}>{client.email}</div>
            <div style={{fontSize:10,color:C.accent,marginTop:2}}>✓ Verified</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ page }) {
  const titles = {
    booking:  { title:"Book a session",  sub:"Fill in your details and connect instantly" },
    sessions: { title:"My sessions",     sub:"View and manage your interpretation history" },
    payments: { title:"Payments",        sub:"Manage your payment methods and billing" },
    favorites:{ title:"Favorites",       sub:"Your saved interpreters" },
    profile:  { title:"Profile",         sub:"Manage your account details" },
    settings: { title:"Settings",        sub:"App preferences and notifications" },
    help:     { title:"Help & support",  sub:"Get assistance anytime" },
  };
  const t = titles[page] || titles.booking;

  return (
    <div style={{
      display:"flex", alignItems:"center",
      padding:"14px 24px",
      borderBottom:`1px solid ${C.border}`,
      background:C.bg2, gap:16, flexShrink:0,
    }}>
      <div>
        <div style={{fontSize:17,fontWeight:700,color:C.t1}}>{t.title}</div>
        <div style={{fontSize:11,color:C.t2,marginTop:2}}>{t.sub}</div>
      </div>
      {page === "booking" && (
        <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"5px 12px",
            background:C.greenDim, border:`1px solid ${C.greenBorder}`,
            borderRadius:8, fontSize:11, fontWeight:600, color:C.green,
          }}>🛡 Secure payment</div>
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"5px 12px",
            background:C.bg3, border:`1px solid ${C.border}`,
            borderRadius:8, fontSize:11, fontWeight:500, color:C.t2,
          }}>🔒 HIPAA compliant</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BOOKING PAGE
// FIX: socket prop removed. Button always calls onConnectNow().
// ═══════════════════════════════════════════════════════════════════
function BookingPage({ onConnectNow, onSchedule }) {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState("video");
  const [mode, setMode] = useState("instant");
  const [language, setLanguage] = useState("Arabic");
  const [purpose, setPurpose] = useState("medical");
  const [duration, setDuration] = useState("30 min");
  const [notes, setNotes] = useState("");

  const rate = sessionType === "video" ? 1.2 : 0.9;
  const durationMin = { "15 min": 15, "30 min": 30, "1 hour": 60 }[duration] || 30;
  const subtotal = (rate * durationMin).toFixed(2);
  const platformFee = 2.40;
  const total = (parseFloat(subtotal) + platformFee).toFixed(2);

  const bookingData = {
    sessionType, mode, language, purpose, duration, notes,
    id: Date.now().toString(),
  };

  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const STEP_LABELS = [
    "Session type", "When do you need it?", "Language", "Purpose", "Duration"
  ];

  const PURPOSE_DATA = [
    { id:"medical",    icon:"❤️",  label:"Medical",    sub:"Hospital & clinic",   color:"#FF4D6D", dimColor:"rgba(255,77,109,0.12)",  borderColor:"rgba(255,77,109,0.35)"  },
    { id:"legal",      icon:"⚖️",  label:"Legal",      sub:"Court & contracts",   color:"#F5C542", dimColor:"rgba(245,197,66,0.12)",  borderColor:"rgba(245,197,66,0.35)"  },
    { id:"business",   icon:"💼",  label:"Business",   sub:"Meetings & deals",    color:"#3BA4FF", dimColor:"rgba(59,164,255,0.12)",  borderColor:"rgba(59,164,255,0.35)"  },
    { id:"government", icon:"🏛️", label:"Government", sub:"Official services",   color:"#00E5A8", dimColor:"rgba(0,229,168,0.12)",   borderColor:"rgba(0,229,168,0.35)"   },
    { id:"education",  icon:"🎓",  label:"Education",  sub:"Schools & learning",  color:"#7C5CFF", dimColor:"rgba(124,92,255,0.12)",  borderColor:"rgba(124,92,255,0.35)"  },
    { id:"other",      icon:"💬",  label:"Other",      sub:"General purpose",     color:"#A0AEC0", dimColor:"rgba(160,174,192,0.1)",  borderColor:"rgba(160,174,192,0.25)" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      height: "100%",
      overflow: "hidden",
    }}>
      {/* ─── LEFT PANEL ─── */}
      <div style={{
        padding: "24px 28px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        {/* STEP PROGRESS */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:600,color:C.t2}}>
              Step {step} of 5 — <span style={{color:C.t1}}>{STEP_LABELS[step-1]}</span>
            </span>
            <span style={{fontSize:11,color:C.t3}}>{Math.round((step/5)*100)}% complete</span>
          </div>
          <div style={{display:"flex",gap:5}}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{
                flex:1, height:4, borderRadius:10,
                background: n < step
                  ? C.accent
                  : n === step
                  ? `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`
                  : C.bg3,
                boxShadow: n === step ? `0 0 8px ${C.accentGlow}` : "none",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        {/* STEP 1: SESSION TYPE */}
        {step === 1 && (
          <div style={{animation:"fadeSlideIn 0.22s ease both"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>Choose session type</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:18}}>Select how you'd like to connect with your interpreter</div>
            <div style={{display:"flex", gap:12}}>
              {[
                { id:"audio", icon:"🎙️", label:"Audio call", sub:"Voice-only • $0.90/min", iconBg:"linear-gradient(135deg,#00E5A8,#00b884)", activeColor:"#00E5A8", activeDim:"rgba(0,229,168,0.12)", activeBorder:"rgba(0,229,168,0.4)", activeGlow:"rgba(0,229,168,0.25)" },
                { id:"video", icon:"📹", label:"Video call", sub:"Face-to-face • $1.20/min", iconBg:"linear-gradient(135deg,#7C5CFF,#6366f1)", activeColor:C.accent, activeDim:C.accentDim, activeBorder:C.accentBorder, activeGlow:C.accentGlow },
              ].map(t => {
                const active = sessionType === t.id;
                return (
                  <div key={t.id} className="lb-session-card" onClick={() => setSessionType(t.id)} style={{
                    flex:1, padding:"20px 18px", borderRadius:14,
                    border: active ? `1px solid ${t.activeBorder}` : `1px solid ${C.border}`,
                    background: active ? t.activeDim : C.bg3,
                    boxShadow: active ? `0 0 0 1px ${t.activeBorder}, 0 8px 28px ${t.activeGlow}` : "none",
                    position:"relative", overflow:"hidden",
                  }}>
                    {active && (
                      <div style={{
                        position:"absolute", top:12, right:12,
                        width:18, height:18, borderRadius:"50%",
                        background: t.activeColor,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, color:"#000", fontWeight:800,
                        boxShadow:`0 0 8px ${t.activeGlow}`,
                      }}>✓</div>
                    )}
                    <div style={{
                      width:40, height:40, borderRadius:10,
                      background: t.iconBg,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, marginBottom:14,
                      boxShadow: active ? `0 4px 14px ${t.activeGlow}` : "none",
                    }}>{t.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:4}}>{t.label}</div>
                    <div style={{fontSize:11,color: active ? t.activeColor : C.t3,fontWeight:500}}>{t.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: WHEN */}
        {step === 2 && (
          <div style={{animation:"fadeSlideIn 0.22s ease both"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>When do you need it?</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:18}}>Connect immediately or plan ahead</div>
            <div style={{display:"flex", gap:12}}>
              {[
                { id:"instant", icon:"⚡", label:"Connect now", sub:"Instant match", badge:"14 online", badgeSub:"Avg wait < 30 sec", activeColor:C.green, activeDim:C.greenDim, activeBorder:C.greenBorder, activeGlow:"rgba(0,229,168,0.2)" },
                { id:"schedule", icon:"🗓️", label:"Schedule later", sub:"Pick date & time", badge:null, badgeSub:"Choose your slot", activeColor:C.accent, activeDim:C.accentDim, activeBorder:C.accentBorder, activeGlow:C.accentGlow },
              ].map(m => {
                const active = mode === m.id;
                return (
                  <div key={m.id} className="lb-when-card" onClick={() => setMode(m.id)} style={{
                    flex:1, padding:"20px 18px", borderRadius:14,
                    border: active ? `1px solid ${m.activeBorder}` : `1px solid ${C.border}`,
                    background: active ? m.activeDim : C.bg3,
                    boxShadow: active ? `0 0 0 1px ${m.activeBorder}, 0 10px 28px ${m.activeGlow}` : "none",
                    position:"relative",
                  }}>
                    {active && (
                      <div style={{
                        position:"absolute", top:12, right:12,
                        width:18, height:18, borderRadius:"50%",
                        background: m.activeColor,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, color:"#000", fontWeight:800,
                      }}>✓</div>
                    )}
                    <div style={{fontSize:22,marginBottom:12}}>{m.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:6}}>{m.label}</div>
                    {m.badge && (
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:6,
                        padding:"4px 10px", background:C.greenDim,
                        border:`1px solid ${C.greenBorder}`,
                        borderRadius:20, marginBottom:8,
                      }}>
                        <span style={{
                          width:6, height:6, borderRadius:"50%",
                          background:C.green,
                          animation:"dotPulse 2s ease-in-out infinite",
                          display:"inline-block", boxShadow:`0 0 6px ${C.green}`,
                        }}/>
                        <span style={{fontSize:11,color:C.green,fontWeight:600}}>{m.badge} interpreters</span>
                      </div>
                    )}
                    <div style={{fontSize:11,color:active ? m.activeColor : C.t3, fontWeight:500}}>{m.badgeSub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE */}
        {step === 3 && (
          <div style={{animation:"fadeSlideIn 0.22s ease both"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>Select language</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:18}}>Choose the language pair for your session</div>
            <div style={{
              position:"relative", background:C.bg3,
              border:`1px solid ${C.border2}`, borderRadius:12, overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
                fontSize:18, pointerEvents:"none", zIndex:1,
              }}>🌐</div>
              <select
                className="lb-lang-select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  width:"100%", padding:"14px 44px 14px 44px",
                  background:"transparent", color:C.t1,
                  fontSize:13, fontWeight:600, fontFamily:C.font,
                  border:"none", appearance:"none", cursor:"pointer", outline:"none",
                }}
              >
                {LANGUAGES.map(l => <option key={l} style={{background:C.bg3}}>{l}</option>)}
              </select>
              <div style={{
                position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                color:C.t3, pointerEvents:"none", fontSize:12,
              }}>▼</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:14}}>
              {["Arabic","Spanish","French","Mandarin","Hindi","Urdu"].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  padding:"5px 13px", borderRadius:20,
                  border:`1px solid ${language===l ? C.accentBorder : C.border}`,
                  background: language===l ? C.accentDim : C.bg3,
                  color: language===l ? C.accent : C.t3,
                  fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:C.font,
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PURPOSE */}
        {step === 4 && (
          <div style={{animation:"fadeSlideIn 0.22s ease both"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>What's the purpose?</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:18}}>This helps us match the right interpreter for you</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
              {PURPOSE_DATA.map(p => {
                const active = purpose === p.id;
                return (
                  <div key={p.id} className="lb-purpose-card" onClick={() => setPurpose(p.id)} style={{
                    padding:"16px 14px", borderRadius:12,
                    border: active ? `1px solid ${p.borderColor}` : `1px solid ${C.border}`,
                    background: active ? p.dimColor : C.bg3,
                    boxShadow: active ? `0 0 0 1px ${p.borderColor}, 0 6px 20px ${p.dimColor}` : "none",
                    position:"relative", textAlign:"left",
                  }}>
                    {active && (
                      <div style={{
                        position:"absolute", top:10, right:10,
                        width:16, height:16, borderRadius:"50%",
                        background: p.color,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:9, color:"#000", fontWeight:900,
                      }}>✓</div>
                    )}
                    <div style={{
                      width:34, height:34, borderRadius:9,
                      background: active ? p.dimColor : "rgba(255,255,255,0.04)",
                      border:`1px solid ${active ? p.borderColor : C.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:16, marginBottom:10,
                    }}>{p.icon}</div>
                    <div style={{fontSize:12,fontWeight:700,color: active ? p.color : C.t1,marginBottom:2}}>{p.label}</div>
                    <div style={{fontSize:10,color:C.t3}}>{p.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: DURATION */}
        {step === 5 && (
          <div style={{animation:"fadeSlideIn 0.22s ease both"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>Session duration</div>
            <div style={{fontSize:12,color:C.t3,marginBottom:18}}>You'll only be charged for the actual time used</div>
            <div style={{display:"flex", gap:10}}>
              {DURATIONS.map(d => {
                const active = duration === d;
                return (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    flex:1, padding:"18px 10px", borderRadius:12,
                    border: active ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
                    background: active
                      ? `linear-gradient(135deg, ${C.accentDim}, rgba(99,102,241,0.08))`
                      : C.bg3,
                    color: active ? C.accent : C.t2,
                    fontFamily:C.font, fontWeight: 700, fontSize:13, cursor:"pointer",
                    boxShadow: active ? `0 0 0 1px ${C.accentBorder}, 0 6px 20px ${C.accentGlow}` : "none",
                  }}>
                    {d}
                    {active && (
                      <div style={{fontSize:10,color:C.accentLight,marginTop:4,fontWeight:500}}>
                        ~${(rate * ({ "15 min":15,"30 min":30,"1 hour":60,"2+ hrs":120 }[d] || 30)).toFixed(2)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div style={{marginTop:20}}>
              <div style={{fontSize:12,fontWeight:600,color:C.t2,marginBottom:8}}>
                Additional notes <span style={{color:C.t3,fontWeight:400}}>(optional)</span>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Medical terminology, specific dialect needed..."
                rows={3}
                style={{
                  width:"100%", padding:"12px 14px",
                  background:C.bg3, border:`1px solid ${C.border}`,
                  borderRadius:10, color:C.t1, fontSize:12,
                  fontFamily:C.font, resize:"none", outline:"none",
                  colorScheme:"dark", lineHeight:1.6,
                }}
              />
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div style={{ display:"flex", gap:10, marginTop:"auto", paddingTop:8 }}>
          {step > 1 && (
            <button onClick={back} style={{
              padding:"13px 24px", borderRadius:10,
              background:C.bg3, color:C.t2,
              border:`1px solid ${C.border}`,
              cursor:"pointer", fontFamily:C.font,
              fontSize:13, fontWeight:600,
            }}>← Back</button>
          )}
          {step < 5 ? (
            <button onClick={next} style={{
              flex:1, padding:"13px", borderRadius:10,
              background:`linear-gradient(135deg, ${C.accent}, #6366f1)`,
              color:"#fff", border:"none", cursor:"pointer",
              fontFamily:C.font, fontSize:13, fontWeight:700,
              boxShadow:`0 4px 20px rgba(124,92,255,0.35)`,
            }}>Continue →</button>
          ) : (
            // ─── FIX: ALWAYS call onConnectNow — no socket bypass ───
            <button
              className="lb-cta-main"
              onClick={() => onConnectNow(bookingData)}
              style={{
                flex:1, padding:"15px", borderRadius:12,
                background:`linear-gradient(135deg, #7C5CFF 0%, #6366f1 50%, #4f6ef7 100%)`,
                color:"#fff", border:"none", cursor:"pointer",
                fontFamily:C.font, fontSize:14, fontWeight:800,
                letterSpacing:"0.2px",
              }}
            >⚡ Connect now — interpreters ready</button>
          )}
        </div>
      </div>

      {/* ─── RIGHT PANEL: PAYMENT SUMMARY ─── */}
      <div style={{
        padding:"24px 20px",
        borderLeft:`1px solid ${C.border}`,
        background:"#0B0F1A",
        overflowY:"auto",
        display:"flex", flexDirection:"column", gap:16,
      }}>
        <div style={{
          background:C.bg2, border:`1px solid ${C.border}`,
          borderRadius:14, padding:18,
        }}>
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:1,marginBottom:14}}>PAYMENT SUMMARY</div>
          {[
            { label:"Session type", value: sessionType === "video" ? "Video call" : "Audio call" },
            { label:"Rate",         value:`$${rate.toFixed(2)} / min` },
            { label:"Duration",     value:`${durationMin} min` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              marginBottom:10,
            }}>
              <span style={{fontSize:12,color:C.t3}}>{label}</span>
              <span style={{fontSize:12,color:C.t2,fontWeight:500}}>{value}</span>
            </div>
          ))}
          <div style={{height:1, background:C.border, margin:"12px 0"}} />
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:12,color:C.t3}}>Subtotal</span>
            <span style={{fontSize:12,color:C.t2,fontWeight:600}}>${subtotal}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <span style={{fontSize:12,color:C.t3}}>Platform fee</span>
            <span style={{fontSize:12,color:C.t2,fontWeight:600}}>$2.40</span>
          </div>
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 14px",
            background:C.accentDim, border:`1px solid ${C.accentBorder}`,
            borderRadius:10,
          }}>
            <span style={{fontSize:13,fontWeight:700,color:C.t1}}>Total</span>
            <span style={{fontSize:20,fontWeight:900,color:C.t1}}>${total}</span>
          </div>
        </div>

        <div style={{
          background:C.bg2, border:`1px solid ${C.border}`,
          borderRadius:14, padding:18,
        }}>
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:1,marginBottom:12}}>PAY WITH</div>
          {DEFAULT_CARDS.map((card, i) => (
            <div key={i} className="lb-saved-card" style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10,
              border:`1px solid ${card.isDefault ? C.accentBorder : C.border}`,
              background: card.isDefault ? C.accentDim : C.bg3,
              marginBottom:8, cursor:"pointer",
            }}>
              <span style={{
                fontSize:9, fontWeight:900, padding:"2px 5px", borderRadius:3,
                background: card.brand==="VISA" ? "#1a56db" : "#2a2a2a", color:"#fff",
                letterSpacing:0.5,
              }}>{card.brand}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.t1}}>•••• {card.last4}</div>
                <div style={{fontSize:10,color:C.t3}}>Exp {card.expiry}</div>
              </div>
              {card.isDefault && (
                <span style={{
                  width:16, height:16, borderRadius:"50%",
                  background: C.accent,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, color:"#fff", fontWeight:900,
                }}>✓</span>
              )}
            </div>
          ))}
        </div>

        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          padding:"10px 14px",
          background:C.greenDim, border:`1px solid ${C.greenBorder}`, borderRadius:10,
        }}>
          <span style={{fontSize:14}}>🔒</span>
          <span style={{fontSize:11,fontWeight:600,color:C.green}}>100% secure payment</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MY SESSIONS PAGE
// ═══════════════════════════════════════════════════════════════════
function SessionsPage({ sessions }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all","completed","missed","scheduled"];
  const filtered = filter==="all" ? sessions : sessions.filter(s=>s.status===filter);
  const td = { padding:"12px 16px", fontSize:12.5, color:C.t1, borderBottom:`1px solid ${C.border}` };

  return (
    <div style={{padding:24}}>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"6px 16px", borderRadius:20,
            border:`1px solid ${filter===f ? C.accent : C.border}`,
            background: filter===f ? C.accentDim : "transparent",
            color: filter===f ? C.accent : C.t2,
            fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:C.font,
          }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <Card padding={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              {["DATE / TIME","LANGUAGE","PURPOSE","DURATION","COST","STATUS"].map(h => (
                <th key={h} style={{
                  fontSize:10, fontWeight:600, letterSpacing:1,
                  color:C.t3, textAlign:"left",
                  padding:"10px 16px", borderBottom:`1px solid ${C.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={td}>{s.time}</td>
                <td style={td}>{s.language}</td>
                <td style={td}>
                  <span style={{display:"flex",alignItems:"center",gap:5}}>
                    {PURPOSE_ICONS[s.purpose]||"💬"} {s.purpose}
                  </span>
                </td>
                <td style={td}>{s.duration}</td>
                <td style={{...td,fontWeight:600}}>{s.cost}</td>
                <td style={td}><Pill status={s.status}/></td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan={6} style={{...td,textAlign:"center",color:C.t3,padding:32}}>No sessions found</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAYMENTS PAGE
// ═══════════════════════════════════════════════════════════════════
function PaymentsPage({ client }) {
  const txns = [
    { desc:"Arabic Medical Session",    date:"Apr 25", amt:"$50.40", type:"charge" },
    { desc:"French Legal Session",      date:"Apr 20", amt:"$25.20", type:"charge" },
    { desc:"Mandarin Business Session", date:"Apr 17", amt:"$73.20", type:"charge" },
    { desc:"Wallet top-up",             date:"Apr 10", amt:"+$50.00",type:"credit" },
    { desc:"Spanish Government Session",date:"Apr 5",  amt:"$31.50", type:"charge" },
  ];
  const td = { padding:"12px 16px", fontSize:12.5, color:C.t1, borderBottom:`1px solid ${C.border}` };

  return (
    <div style={{padding:24}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <SH title="Wallet" />
            <div style={{
              padding:20, textAlign:"center",
              background:`linear-gradient(135deg,${C.accentDim},rgba(99,102,241,0.08))`,
              border:`1px solid ${C.accentBorder}`, borderRadius:10, marginBottom:14,
            }}>
              <div style={{fontSize:11,color:C.t3,marginBottom:6}}>Available balance</div>
              <div style={{fontSize:36,fontWeight:800,color:C.t1}}>${client.walletBalance.toFixed(2)}</div>
            </div>
            <button style={{
              width:"100%", padding:"11px", borderRadius:8, border:"none",
              background:`linear-gradient(135deg,${C.accent},#6366f1)`,
              color:"#fff", fontSize:13, fontWeight:600,
              cursor:"pointer", fontFamily:C.font,
            }}>+ Add money</button>
          </Card>
          <Card>
            <SH title="Payment methods" />
            {DEFAULT_CARDS.map((card, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", borderRadius:8,
                border:`1px solid ${card.isDefault ? C.accentBorder : C.border}`,
                background: card.isDefault ? C.accentDim : C.bg3,
                marginBottom:8,
              }}>
                <span style={{
                  fontSize:9, fontWeight:900, padding:"1px 4px", borderRadius:2,
                  background: card.brand==="VISA" ? "#1a56db" : "#1e1e1e", color:"#fff",
                }}>{card.brand}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.t1}}>•••• {card.last4}</div>
                  <div style={{fontSize:10,color:C.t3}}>Exp {card.expiry}</div>
                </div>
                {card.isDefault && (
                  <span style={{
                    fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                    background:C.greenDim, color:C.green, border:`1px solid ${C.greenBorder}`,
                  }}>Default</span>
                )}
              </div>
            ))}
            <button style={{
              width:"100%", padding:"9px", borderRadius:8,
              border:`1px dashed ${C.border2}`, background:"transparent",
              color:C.t2, fontSize:12, cursor:"pointer", fontFamily:C.font,
            }}>+ Add new card</button>
          </Card>
        </div>
        <Card>
          <SH title="Transaction history" />
          {txns.map(({ desc, date, amt, type }, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center",
              padding:"11px 0",
              borderBottom: i<txns.length-1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width:34, height:34, borderRadius:8,
                background: type==="credit" ? C.greenDim : C.bg3,
                border:`1px solid ${type==="credit" ? C.greenBorder : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, marginRight:12, flexShrink:0,
              }}>
                {type==="credit" ? "💰" : "📞"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5,fontWeight:500,color:C.t1}}>{desc}</div>
                <div style={{fontSize:10,color:C.t3,marginTop:2}}>{date}</div>
              </div>
              <div style={{fontSize:13, fontWeight:700, color: type==="credit" ? C.green : C.t1}}>{amt}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function PlaceholderPage({ label }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"center",
      height:"100%", flexDirection:"column", gap:12,
      color:C.t3, fontSize:14,
    }}>
      <div style={{fontSize:40}}>🚧</div>
      <div style={{fontWeight:600,color:C.t2}}>{label}</div>
      <div style={{fontSize:12}}>This page is under construction</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT: CLIENT DASHBOARD
// FIX: socket prop removed from component signature entirely.
// ═══════════════════════════════════════════════════════════════════
export default function ClientDashboard({
  client        = DEFAULT_CLIENT,
  availableCount = 14,
  sessions       = DEFAULT_SESSIONS,
  onConnectNow   = (data) => alert(`Connecting: ${JSON.stringify(data, null, 2)}`),
  onSchedule     = () => alert("Session scheduled!"),
  onAddMoney     = () => alert("Add money flow"),
  onAddCard      = () => alert("Add card flow"),
  onChatSupport  = () => alert("Support chat opened"),
}) {
  const [page, setPage] = useState("booking");

  const renderPage = () => {
    switch(page) {
      case "booking":   return <BookingPage onConnectNow={onConnectNow} onSchedule={onSchedule} />;
      case "sessions":  return <SessionsPage sessions={sessions}/>;
      case "payments":  return <PaymentsPage client={client}/>;
      case "favorites": return <PlaceholderPage label="Favorites"/>;
      case "profile":   return <PlaceholderPage label="Profile"/>;
      case "settings":  return <PlaceholderPage label="Settings"/>;
      case "help":      return <PlaceholderPage label="Help & Support"/>;
      default:          return <BookingPage onConnectNow={onConnectNow} onSchedule={onSchedule}/>;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        display:"flex", height:"100vh",
        fontFamily:C.font, background:C.bg, color:C.t1,
        fontSize:13, overflow:"hidden",
      }}>
        <Sidebar
          activePage={page}
          onNav={setPage}
          client={client}
          onAddMoney={onAddMoney}
          onAddCard={onAddCard}
          onChatSupport={onChatSupport}
        />
        <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
          <Topbar page={page} />
          <div style={{flex:1, overflow:"hidden", animation:"fadeSlideIn .22s ease both"}}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}