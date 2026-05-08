import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import ClientDashboard from './Pages/client/ClientDashboard';
import InterpreterDashboard from './Pages/interpreter/InterpreterDashboard';
import AdminDashboard from './Pages/admin/AdminDashboard';
import CallRoom from './components/callroom/CallRoom';
import useRingtone from './hooks/useRingtone';

// ── ENV CONFIG (Vite compatible) ─────────────────────────────────
const AGORA_APP_ID = '3bfd81124304492ea3d119b90d0497c5';
const SOCKET_URL   = 'https://lingobridge-production.up.railway.app';
const IS_DEV       = import.meta.env.DEV;

if (!AGORA_APP_ID) {
  console.error('Missing VITE_AGORA_APP_ID environment variable');
}

const ROLES = ['client', 'interpreter', 'admin'];

const DEMO_USERS = {
  client:      { name: 'Sara Hassan',    initials: 'SH', role: 'client'      },
  interpreter: { name: 'Ahmad Chaudhry', initials: 'AC', role: 'interpreter' },
  admin:       { name: 'Admin',          initials: 'AD', role: 'admin'       },
};

// ── DEV ROLE SWITCHER (ONLY ONE definition) ─────────────────────────
function DevRoleSwitcher({ role, onChange }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: 'rgba(13,21,38,0.95)',
      border: '1px solid rgba(99,102,241,0.35)',
      borderRadius: 14, padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 0 24px rgba(99,102,241,0.2)',
      backdropFilter: 'blur(12px)',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        View as
      </span>
      {ROLES.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          style={{
            padding: '5px 12px', borderRadius: 8, border: 'none',
            background: role === item ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.07)',
            color: role === item ? '#fff' : 'rgba(255,255,255,0.45)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            transition: 'all 0.15s',
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ── CONNECTING OVERLAY ──────────────────────────────────────────
function ConnectingOverlay({ bookingData, onCancel }) {
  return (
    <div className="overlay-backdrop">
      <div className="overlay-spinner" />
      <div className="text-center">
        <div className="overlay-title">Connecting to call…</div>
        <div className="overlay-meta">
          {bookingData?.sessionType === 'video' ? 'Video call' : 'Audio call'}
          {bookingData?.language ? ` · ${bookingData.language}` : ''}
          {bookingData?.purpose  ? ` · ${bookingData.purpose}`  : ''}
        </div>
      </div>
      {onCancel && (
        <button onClick={onCancel} className="overlay-cancel-btn">
          Cancel
        </button>
      )}
    </div>
  );
}

// ── ERROR TOAST ───────────────────────────────────────────────────
function ErrorToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="error-toast">
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-inherit cursor-pointer text-lg p-0 leading-none"
        style={{ color: '#fca5a5' }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ── GLOBAL ANIMATIONS (inject once) ─────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @keyframes lb-spin { to { transform: rotate(360deg); } }
      .lb-spinner { animation: lb-spin 0.8s linear infinite; }
      @keyframes lb-fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      .lb-fade-in { animation: lb-fadeIn 0.2s ease; }
    `}</style>
  );
}

// ── ROOT APP ────────────────────────────────────────────────────
export default function App() {
  const [role,         setRole]         = useState('client');
  const [callState,    setCallState]    = useState('idle');
  const [callParams,   setCallParams]   = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [socketReady,  setSocketReady]  = useState(false);
  const [isRinging,    setIsRinging]    = useState(false);

  useRingtone(isRinging);

  const user = DEMO_USERS[role];
  const socketRef     = useRef(null);
  const callParamsRef = useRef(null);
  const roleRef       = useRef(role);

  useEffect(() => { roleRef.current = role; }, [role]);

  // ── Stable helpers (safe to use in socket effect deps) ───────
  const cleanupCall = useCallback(() => {
    setIsRinging(false);
    callParamsRef.current = null;
    setCallState('idle');
    setCallParams(null);
  }, []);

  const emitEndCall = useCallback(() => {
    const socket = socketRef.current;
    const roomId = callParamsRef.current?.roomId;
    if (socket?.connected && roomId) {
      socket.emit('end-call', { roomId });
    }
  }, []);

  const endCall = useCallback(() => {
    emitEndCall();
    cleanupCall();
  }, [emitEndCall, cleanupCall]);

  // ── SOCKET LIFECYCLE ─────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports:           ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay:    1000,
      timeout:              20000,
      pingTimeout:          20000,
      pingInterval:         10000,
    });

    socketRef.current = socket;

    if (IS_DEV) {
      socket.onAny((eventName, ...args) => {
        console.log('📨 socket event received:', eventName, args);
      });
    }

    const onConnect = () => {
      console.log('🟢 connected:', socket.id);
      setSocketReady(true);
    };

    const onDisconnect = (reason) => {
      console.log('🔴 disconnected:', reason);
      setSocketReady(false);
      // Auto-cleanup if we were mid-call
      if (callParamsRef.current) {
        cleanupCall();
      }
    };

    const onConnectError = (err) => {
      console.error('❌ connect error:', err.message);
    };

    const onCallAccepted = (data) => {
      setIsRinging(false);
      console.log('🟢 call-accepted | role:', roleRef.current, data);

      // Safety: ignore stray events
      if (!callParamsRef.current) {
        console.warn('Ignoring call-accepted: no active call params');
        return;
      }

      const channelName = data.channelName || data.roomId;
      if (!channelName) {
        setConnectError('Call accepted but no channel provided.');
        cleanupCall();
        return;
      }

      const merged = {
        ...callParamsRef.current,
        channel: channelName,
        roomId:  data.roomId || callParamsRef.current.roomId || channelName,
        token:   data.token ?? null,
      };
      callParamsRef.current = merged;
      setCallParams(merged);
      setCallState('in-call');
    };

    const onCallEnded = () => cleanupCall();

    const onNoInterpreters = () => {
      setConnectError('No interpreters available.');
      cleanupCall();
    };

    socket.on('connect',         onConnect);
    socket.on('disconnect',      onDisconnect);
    socket.on('connect_error',   onConnectError);
    socket.on('call-accepted',   onCallAccepted);
    socket.on('call-ended',      onCallEnded);
    socket.on('no-interpreters', onNoInterpreters);

    return () => {
      socket.off('connect',         onConnect);
      socket.off('disconnect',      onDisconnect);
      socket.off('connect_error',   onConnectError);
      socket.off('call-accepted',   onCallAccepted);
      socket.off('call-ended',      onCallEnded);
      socket.off('no-interpreters', onNoInterpreters);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [cleanupCall]);

  // ── CLIENT: CONNECT NOW ──────────────────────────────────────
  const handleConnectNow = useCallback((bookingData) => {
    setConnectError(null);
    const socket = socketRef.current;
    if (!socket?.connected) {
      setConnectError('Not connected to server. Please refresh and try again.');
      return;
    }
    const roomId = bookingData.id || `room-${Date.now()}`;
    const params = {
      bookingData: { ...bookingData, id: roomId, roomId },
      channel:     null,
      roomId,
      token:       null,
    };
    callParamsRef.current = params;
    setCallParams(params);
    setCallState('waiting');
    setIsRinging(true);
    socket.emit('new-request', {
      roomId,
      clientName: DEMO_USERS.client.name,
      language:   bookingData.language,
      type:       bookingData.sessionType,
      duration:   bookingData.duration,
      purpose:    bookingData.purpose,
    });
  }, []);

  // ── INTERPRETER: ACCEPT CALL ─────────────────────────────────
  const handleAcceptCall = useCallback((bookingData) => {
    setConnectError(null);
    const socket = socketRef.current;
    if (!socket?.connected) {
      setConnectError('Not connected to server.');
      return;
    }
    const roomId = bookingData?.roomId || bookingData?.id;
    if (!roomId) {
      setConnectError('Cannot accept this call — room ID is missing.');
      return;
    }
    const params = {
      bookingData: { ...bookingData, roomId },
      channel:     null,
      roomId,
      token:       null,
    };
    callParamsRef.current = params;
    setCallParams(params);
    setCallState('waiting');
    console.log('📤 [accept-call] emitting:', roomId);
    socket.emit('accept-call', { roomId });
  }, []);

  // ── ROLE CHANGE (dev tool) ───────────────────────────────────
  const handleRoleChange = useCallback((nextRole) => {
    endCall();
    setRole(nextRole);
  }, [endCall]);

  const handleSchedule = useCallback((bookingData) => {
    alert(`Session scheduled!\n\n${JSON.stringify(bookingData, null, 2)}`);
  }, []);

  // ── RENDER: IN-CALL ──────────────────────────────────────────
  if (callState === 'in-call') {
    if (!callParams?.channel) {
      return (
        <>
          <GlobalStyles />
          <ConnectingOverlay bookingData={callParams?.bookingData} onCancel={endCall} />
        </>
      );
    }
    return (
      <>
        <GlobalStyles />
        <CallRoom
          appId={AGORA_APP_ID}
          channel={callParams.channel}
          token={callParams.token ?? null}
          uid={role === 'client' ? 1 : 2}   // TODO: request UID from server
          userName={user.name}
          sessionType={callParams.bookingData?.sessionType ?? 'video'}
          onLeave={endCall}
        />
      </>
    );
  }

  // ── RENDER: DASHBOARDS ───────────────────────────────────────
  return (
    <>
      <GlobalStyles />

      {callState === 'waiting' && (
        <ConnectingOverlay bookingData={callParams?.bookingData} onCancel={endCall} />
      )}

      {connectError && (
        <ErrorToast message={connectError} onClose={() => setConnectError(null)} />
      )}

      {role === 'client' && (
        <ClientDashboard onConnectNow={handleConnectNow} onSchedule={handleSchedule} />
      )}

      {role === 'interpreter' && (
        <InterpreterDashboard
          user={user}
          onCallStart={handleAcceptCall}
          socketReady={socketReady}
          socket={socketRef.current}
        />
      )}

      {role === 'admin' && <AdminDashboard user={user} />}

      {IS_DEV && <DevRoleSwitcher role={role} onChange={handleRoleChange} />}
    </>
  );
}