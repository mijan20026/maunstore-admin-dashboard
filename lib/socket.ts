import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();

// /lib/socket.ts
// import { io, Socket } from "socket.io-client";
// import type { Message, ChatSession } from "@/types";

// class SocketService {
//   private socket: Socket | null = null;

//   public connect() {
//     if (!this.socket) {
//       this.socket = io("http://10.10.7.111:5003", {
//         path: "/socket.io", // default path for Socket.IO server
//         transports: ["websocket"], // optional: enforce WebSocket
//         autoConnect: true,
//       });

//       this.socket.on("connect", () => {
//         console.log("Connected to socket server:", this.socket?.id);
//       });

//       this.socket.on("disconnect", () => {
//         console.log("Disconnected from socket server");
//       });
//     }
//     return this.socket;
//   }

//   public getSocket() {
//     if (!this.socket) return this.connect();
//     return this.socket;
//   }
// }

// export const socketService = new SocketService();
