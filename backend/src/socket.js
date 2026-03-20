import { Server } from 'socket.io';
import { verifyToken } from './utils.js';
import { config } from './config.js';

/**
 * Initialize Socket.IO server
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Store connected users
  const connectedUsers = new Map();

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      // Allow anonymous connections for public updates
      socket.isAuthenticated = false;
      return next();
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.isAuthenticated = true;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      socket.isAuthenticated = false;
      next();
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    if (socket.isAuthenticated) {
      connectedUsers.set(socket.userId, socket.id);
      console.log(`👤 Authenticated user: ${socket.userId}`);
    }

    // Join room for specific complaint tracking
    socket.on('track-complaint', (complaintId) => {
      socket.join(`complaint:${complaintId}`);
      console.log(`📍 Socket ${socket.id} tracking complaint: ${complaintId}`);
      socket.emit('tracking-confirmed', { complaintId });
    });

    // Leave complaint tracking room
    socket.on('untrack-complaint', (complaintId) => {
      socket.leave(`complaint:${complaintId}`);
      console.log(`📤 Socket ${socket.id} stopped tracking complaint: ${complaintId}`);
    });

    // Join admin dashboard room
    socket.on('join-dashboard', () => {
      if (socket.isAuthenticated) {
        socket.join('admin-dashboard');
        console.log(`📊 Socket ${socket.id} joined admin dashboard`);
        socket.emit('dashboard-joined');
      } else {
        socket.emit('error', { message: 'Authentication required' });
      }
    });

    // Join power grid monitoring room
    socket.on('join-power-grid', () => {
      socket.join('power-grid');
      console.log(`⚡ Socket ${socket.id} joined power grid monitoring`);
      socket.emit('power-grid-joined');
    });

    // Leave power grid monitoring room
    socket.on('leave-power-grid', () => {
      socket.leave('power-grid');
      console.log(`⚡ Socket ${socket.id} left power grid monitoring`);
    });

    // Ping/Pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`);
      
      if (socket.isAuthenticated) {
        connectedUsers.delete(socket.userId);
      }
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error from ${socket.id}:`, error);
    });
  });

  // Return io instance with helper methods
  return {
    io,
    
    /**
     * Emit complaint status update to specific complaint trackers
     */
    emitComplaintUpdate: (complaintId, data) => {
      io.to(`complaint:${complaintId}`).emit('complaint-updated', {
        complaintId,
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`📢 Complaint update emitted: ${complaintId}`);
    },

    /**
     * Emit new complaint notification to admin dashboard
     */
    emitNewComplaint: (complaint) => {
      io.to('admin-dashboard').emit('new-complaint', {
        complaint,
        timestamp: new Date().toISOString()
      });
      console.log(`📢 New complaint notification: ${complaint.complaintId}`);
    },

    /**
     * Emit dashboard statistics update
     */
    emitDashboardUpdate: (stats) => {
      io.to('admin-dashboard').emit('dashboard-update', {
        stats,
        timestamp: new Date().toISOString()
      });
      console.log('📢 Dashboard update emitted');
    },

    /**
     * Emit power grid update to all monitoring clients
     */
    emitPowerGridUpdate: (areaCode, data) => {
      io.to('power-grid').emit('power-grid-update', {
        areaCode,
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`⚡ Power grid update emitted: ${areaCode}`);
    },

    /**
     * Emit power outage alert
     */
    emitPowerOutageAlert: (areaData) => {
      io.emit('power-outage-alert', {
        ...areaData,
        timestamp: new Date().toISOString()
      });
      console.log(`🚨 Power outage alert: ${areaData.areaCode}`);
    },

    /**
     * Send notification to specific user
     */
    emitToUser: (userId, event, data) => {
      const socketId = connectedUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit(event, {
          ...data,
          timestamp: new Date().toISOString()
        });
        console.log(`📤 Event '${event}' sent to user: ${userId}`);
        return true;
      }
      return false;
    },

    /**
     * Broadcast to all connected clients
     */
    broadcast: (event, data) => {
      io.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`📡 Broadcast event: ${event}`);
    },

    /**
     * Get connected users count
     */
    getConnectedUsersCount: () => {
      return connectedUsers.size;
    },

    /**
     * Get total connected clients
     */
    getConnectedClientsCount: () => {
      return io.engine.clientsCount;
    },

    /**
     * Check if user is online
     */
    isUserOnline: (userId) => {
      return connectedUsers.has(userId);
    }
  };
};

export default initializeSocket;
