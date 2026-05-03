import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import ClientDashboard from './Pages/client/ClientDashboard';
import InterpreterDashboard from './Pages/interpreter/InterpreterDashboard';
import AdminDashboard from './Pages/admin/AdminDashboard';
import CallRoom from './components/callroom/CallRoom';
import useRingtone from './hooks/useRingtone';


const AGORA_APP_ID = '3bfd81124304492ea3d119b90d0497c5';
const SOCKET_URL   =  'http://localhost:3001';

const ROLES = ['client', 'interpreter', 'admin'];
const DEMO_USERS = {
  client:      { name: 'Sara Hassan',    initials: 'SH', role: 'client'      },
  interpreter: { name: 'Ahmad Chaudhry', initials: 'AC', role: 'interpreter' },
  admin:       { name: 'Admin',          initials: 'AD', role: 'admin'        },
};

// ── DEV ROLE SWITCHER ─────────────────────────────────────────────
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

// ── CONNECTING OVERLAY ────────────────────────────────────────────
function ConnectingOverlay({ bookingData, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: 'rgba(5,8,16,0.92)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: 52, height: 52,
        border: '3px solid rgba(124,92,255,0.2)',
        borderTopColor: '#7C5CFF',
        borderRadius: '50%',
        animation: 'lb-spin 0.8s linear infinite',
      }} />
      <style>{'@keyframes lb-spin { to { transform: rotate(360deg); } }'}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          Connecting to call…
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          {bookingData?.sessionType === 'video' ? 'Video call' : 'Audio call'}
          {bookingData?.language ? ` · ${bookingData.language}` : ''}
          {bookingData?.purpose  ? ` · ${bookingData.purpose}`  : ''}
        </div>
      </div>
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: 8, padding: '8px 22px', borderRadius: 8,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
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
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9000,
      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: 10, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#fca5a5',
      maxWidth: 420, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
      animation: 'lb-fadeIn 0.2s ease',
    }}>
      <style>{'@keyframes lb-fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }'}</style>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────
export default function App() {
  const [role,         setRole]         = useState('client');
  const [callState,    setCallState]    = useState('idle');
  const [callParams,   setCallParams]   = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [socketReady,  setSocketReady]  = useState(false);
  
  const [isRinging, setIsRinging] = useState(false);
  useRingtone(isRinging);
    
  const user          = DEMO_USERS[role];
  const socketRef     = useRef(null);       // ✅ starts as null, set inside useEffect
  const callParamsRef = useRef(null);
  const roleRef       = useRef(role);

  useEffect(() => { roleRef.current = role; }, [role]);

  // ── SOCKET LIFECYCLE ──────────────────────────────────────────
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

    socket.onAny((eventName, ...args) => {
      console.log('📨 socket event received:', eventName, args);
    });

    const onConnect = () => {
      console.log('🟢 connected:', socket.id);
      setSocketReady(true);
    };

    const onDisconnect = (reason) => {
      console.log('🔴 disconnected:', reason);
      setSocketReady(false);
    };

    const onConnectError = (err) => {
      console.error('❌ connect error:', err.message);
    };

    const onCallAccepted = (data) => {
      setIsRinging(false); 
      console.log('🟢 call-accepted | role:', roleRef.current, data);
      const channelName = data.channelName || data.roomId;
      if (!channelName) {
        setConnectError('Call accepted but no channel provided.');
        _cleanupCall();
        return;
      }
      const merged = {
        ...callParamsRef.current,
        channel: channelName,
        roomId:  data.roomId || callParamsRef.current?.roomId || channelName,
        token:   data.token ?? null,
      };
      callParamsRef.current = merged;
      setCallParams(merged);
      setCallState('in-call');
    };

    const onCallEnded = () => { _cleanupCall(); };

    const onNoInterpreters = () => {
      setConnectError('No interpreters available.');
      _cleanupCall();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── HELPERS ───────────────────────────────────────────────────
  function _cleanupCall() {
     setIsRinging(false);
    callParamsRef.current = null;
    setCallState('idle');
    setCallParams(null);
  }

  function _emitEndCall() {
    const socket = socketRef.current;
    const roomId = callParamsRef.current?.roomId;
    if (socket?.connected && roomId) {
      socket.emit('end-call', { roomId });
    }
  }

  // ── CLIENT: CONNECT NOW ───────────────────────────────────────
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

  // ── INTERPRETER: ACCEPT CALL ──────────────────────────────────
  const handleAcceptCall = useCallback((bookingData) => {
    setConnectError(null);
    const socket = socketRef.current;
    if (!socket?.connected) {
      setConnectError('Not connected to server.');
      return;
    }
    const roomId = bookingData.roomId || bookingData.id;
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

  // ── LEAVE CALL ────────────────────────────────────────────────
  const handleLeave = useCallback(() => {
    _emitEndCall();
    _cleanupCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelConnect = useCallback(() => {
    _emitEndCall();
    _cleanupCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── ROLE CHANGE (dev tool) ────────────────────────────────────
  const handleRoleChange = useCallback((nextRole) => {
    _emitEndCall();
    _cleanupCall();
    setRole(nextRole);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSchedule = useCallback((bookingData) => {
    alert(`Session scheduled!\n\n${JSON.stringify(bookingData, null, 2)}`);
  }, []);

  // ── RENDER: IN-CALL ───────────────────────────────────────────
  if (callState === 'in-call') {
    if (!callParams?.channel) {
      return (
        <ConnectingOverlay
          bookingData={callParams?.bookingData}
          onCancel={handleCancelConnect}
        />
      );
    }
    return (
      <CallRoom
        appId={AGORA_APP_ID}
        channel={callParams.channel}
        token={callParams.token ?? null}
        uid={role === 'client' ? 1 : 2}
        userName={user.name}
        sessionType={callParams.bookingData?.sessionType ?? 'video'}
        onLeave={handleLeave}
      />
    );
  }

  // ── RENDER: DASHBOARDS ────────────────────────────────────────
  return (
    <>
      {callState === 'waiting' && (
        <ConnectingOverlay
          bookingData={callParams?.bookingData}
          onCancel={handleCancelConnect}
        />
      )}

      {connectError && (
        <ErrorToast
          message={connectError}
          onClose={() => setConnectError(null)}
        />
      )}

    
        <ClientDashboard
          onConnectNow={handleConnectNow}
          onSchedule={handleSchedule}
        />
      )}

      {role === 'interpreter' && (
        <InterpreterDashboard
          user={user}
          onCallStart={handleAcceptCall}
          socketReady={socketReady}
          socket={socketRef.current}
        />
      )}

      {role === 'admin' && (
        <AdminDashboard user={user} />
      )}

      <DevRoleSwitcher role={role} onChange={handleRoleChange} />
    </>
  );
}