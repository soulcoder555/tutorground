import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "./config/env";
import { verifyAccessToken } from "./utils/jwt";

let io: Server | null = null;
const allowedOrigins = Array.from(new Set([env.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"]));

function readCookie(header: string | undefined, name: string) {
  if (!header) return "";
  const cookies = header.split(";").map((part) => part.trim());
  const match = cookies.find((part) => part.startsWith(`${name}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(name.length + 1));
}

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = String(socket.handshake.auth?.token || socket.handshake.query?.token || readCookie(socket.handshake.headers.cookie, "accessToken") || "");
    if (!token) return next();
    try {
      const user = verifyAccessToken(token);
      socket.data.user = user;
      socket.join(`user:${user.id}`);
      return next();
    } catch {
      return next();
    }
  });

  io.on("connection", (socket) => {
    socket.on("session:join", ({ sessionId }: { sessionId: string }) => {
      if (sessionId) socket.join(`session:${sessionId}`);
    });

    socket.on("doubt:raised", (payload: { sessionId: string; studentId: string; studentName: string; timestamp?: string }) => {
      if (!payload.sessionId) return;
      io?.to(`session:${payload.sessionId}`).emit("doubt:raised", {
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      });
    });

    socket.on("doubt:acknowledged", (payload: { sessionId: string; studentId: string }) => {
      if (!payload.sessionId) return;
      io?.to(`session:${payload.sessionId}`).emit("doubt:acknowledged", payload);
    });

    socket.on("presence:update", (payload: { sessionId: string; status: string }) => {
      const user = socket.data.user;
      if (!payload.sessionId || !user) return;
      io?.to(`session:${payload.sessionId}`).emit("presence:update", {
        userId: user.id,
        name: user.name,
        status: payload.status,
        timestamp: new Date().toISOString()
      });
    });
  });

  return io;
}

export function getIo() {
  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToSession(sessionId: string, event: string, payload: unknown) {
  io?.to(`session:${sessionId}`).emit(event, payload);
}
