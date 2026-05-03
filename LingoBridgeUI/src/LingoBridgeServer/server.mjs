import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

const interpreters = new Map();
const rooms = {};

io.on('connection', (socket) => {
  console.log('🔌 Connected:', socket.id);

  socket.on('register', ({ role }) => {
    if (role === 'interpreter') {
      interpreters.set(socket.id, socket);
      socket.join('interpreters');
      console.log('🟢 Interpreter registered:', socket.id);
    }
  });

  socket.on('new-request', (data) => {
    console.log('📨 New request from client:', data);
    const { roomId } = data;

    if (interpreters.size === 0) {
      socket.emit('no-interpreters');
      return;
    }

    socket.join(roomId);
    rooms[roomId] = [socket.id];

    io.to('interpreters').emit('incoming-request', data);
    console.log('📡 Forwarded to interpreters room');
  });

  socket.on('accept-call', async ({ roomId }) => {
    console.log('✅ Interpreter accepted:', roomId);
    console.log('🔍 Sockets in room before join:', io.sockets.adapter.rooms.get(roomId));

    await socket.join(roomId);

    console.log('🔍 Sockets in room after join:', io.sockets.adapter.rooms.get(roomId));

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    const payload = { roomId, channelName: roomId, token: null };

    io.to(roomId).emit('call-accepted', payload);
    console.log('📡 call-accepted emitted to room:', roomId);
  });

  // ─── WebRTC Signaling Relay ───────────────────────────────────────────────

  /**
   * FIX 1: key changed from `sdp` → `offer` to match App.jsx.
   * App.jsx emits:    { roomId, offer }
   * Server forwards:  { offer, from }
   * App.jsx receives: { offer, from }  → new RTCSessionDescription(offer) ✅
   */
  socket.on('webrtc-offer', ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    console.log('📤 webrtc-offer from', socket.id, '→ room', roomId);
    socket.to(roomId).emit('webrtc-offer', { offer, from: socket.id });
  });

  /**
   * FIX 2: key changed from `sdp` → `answer` to match App.jsx.
   * App.jsx emits:    { roomId, answer, to? }
   * Server forwards:  { answer, from }
   * App.jsx receives: { answer, from }  → new RTCSessionDescription(answer) ✅
   *
   * `to` is the socket.id of the offerer (App.jsx fix #3 adds this).
   * Falls back to room broadcast when `to` is absent so it still works
   * without that fix applied.
   */
  socket.on('webrtc-answer', ({ roomId, answer, to }) => {
    if (!answer) return;
    console.log('📥 webrtc-answer from', socket.id, '→', to || `room ${roomId}`);

    if (to) {
      io.to(to).emit('webrtc-answer', { answer, from: socket.id });
    } else if (roomId) {
      socket.to(roomId).emit('webrtc-answer', { answer, from: socket.id });
    }
  });

  /**
   * ICE candidates — key was already `candidate` which matches App.jsx.
   * No change needed here; included for completeness.
   * Payload: { roomId, candidate, to? }
   */
  socket.on('webrtc-ice-candidate', ({ roomId, candidate, to }) => {
    if (!candidate) return;
    console.log('🧊 ICE candidate from', socket.id, '→', to || `room ${roomId}`);

    if (to) {
      io.to(to).emit('webrtc-ice-candidate', { candidate, from: socket.id });
    } else if (roomId) {
      socket.to(roomId).emit('webrtc-ice-candidate', { candidate, from: socket.id });
    }
  });

  // ─── End WebRTC Signaling ─────────────────────────────────────────────────

  socket.on('end-call', ({ roomId }) => {
    io.to(roomId).emit('call-ended');

    // Clean up room tracking
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
  });

  socket.on('disconnect', () => {
    interpreters.delete(socket.id);
    console.log('🔴 Disconnected:', socket.id);

    // Notify any room this socket was part of
    for (const [roomId, members] of Object.entries(rooms)) {
      if (members.includes(socket.id)) {
        io.to(roomId).emit('call-ended');
        delete rooms[roomId];
      }
    }
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
