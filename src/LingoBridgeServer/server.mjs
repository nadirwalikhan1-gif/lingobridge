import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3001;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 20000,
  pingInterval: 10000,
});

const interpreters = new Map();
const rooms = {};

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  socket.on('register', ({ role }) => {
    if (role === 'interpreter') {
      interpreters.set(socket.id, socket);
      console.log('interpreter registered:', socket.id, '| total:', interpreters.size);
      const pending = Object.entries(rooms)
        .filter(([, r]) => !r.interpreterId)
        .map(([roomId, r]) => ({ roomId, ...r.requestData }));
      if (pending.length) socket.emit('pending-requests', pending);
    }
  });

  socket.on('new-request', (data) => {
    const { roomId } = data;
    if (!roomId) return;
    if (rooms[roomId]) return;
    if (interpreters.size === 0) { socket.emit('no-interpreters'); return; }
    socket.join(roomId);
    rooms[roomId] = { clientId: socket.id, interpreterId: null, requestData: data };
    interpreters.forEach((intSocket) => {
      intSocket.emit('incoming-request', { ...data, roomId });
    });
    console.log('new-request:', roomId, '| interpreters:', interpreters.size);
  });

  socket.on('accept-call', async ({ roomId }) => {
    console.log('accept-call received:', roomId);
    const room = rooms[roomId];
    if (!room) { socket.emit('call-cancelled'); return; }
    if (room.interpreterId) { socket.emit('call-already-taken'); return; }

    room.interpreterId = socket.id;
    socket.join(roomId);

    const clientSocket = io.sockets.sockets.get(room.clientId);
    if (clientSocket) {
      clientSocket.join(roomId);
      console.log('client joined room:', room.clientId);
    } else {
      console.log('WARNING: client socket not found:', room.clientId);
    }

    const socketsInRoom = await io.in(roomId).fetchSockets();
    console.log('sockets in room:', socketsInRoom.map(s => s.id));

    const payload = { roomId, channelName: roomId, token: null };
    io.to(roomId).emit('call-accepted', payload);
    console.log('call-accepted emitted to room:', roomId);
  });

  socket.on('end-call', ({ roomId }) => {
    if (!roomId || !rooms[roomId]) return;
    io.to(roomId).emit('call-ended', {});
    delete rooms[roomId];
    console.log('call ended:', roomId);
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnected:', socket.id, 'reason:', reason);
    interpreters.delete(socket.id);
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.clientId === socket.id || room.interpreterId === socket.id) {
        const otherId = room.clientId === socket.id ? room.interpreterId : room.clientId;
        if (otherId) io.to(otherId).emit('call-ended', {});
        delete rooms[roomId];
      }
    }
  });
});
httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});