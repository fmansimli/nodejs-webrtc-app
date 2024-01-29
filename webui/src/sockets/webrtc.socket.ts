import { type Socket, io } from "socket.io-client";

let socket: Socket;
const BASE_URL = import.meta.env.VITE_HOST_URL;

export const initWebRTC = (token: string) => {
  if (socket?.connected) {
    return;
  }
  socket = io(BASE_URL ? BASE_URL + "/webrtc" : "/webrtc", {
    reconnectionAttempts: 10,
    reconnection: true,
    reconnectionDelay: 1000,
    transports: ["websocket", "pooling"],
    auth: {
      token: "Bearer " + token
    }
  });

  socket.on("connect", () => {
    console.log("SOCKET_CONNECTED:");
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("SOCKET_CONN_ERROR:", error);
  });

  socket.on("unauthorized", (_data) => {});

  socket.on("success", (_data) => {});
};

export const disconnect = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket.removeAllListeners();
};

export const reconnect = (): void => {
  if (socket?.disconnected) {
    socket.connect();
  }
};

export const joinGlobal = () => {
  socket.emit("random", {}, () => {});
};

export const heyIn = (callback: (data: any) => void) => {
  socket.on("hey", ({ pid, pname }: any) => {
    socket.emit("heyy", { pid, pname }, () => {
      callback({ pid, pname });
    });
  });
};

export const replyIn = (callback: (data: any) => void) => {
  socket.on("heyy", ({ pid, pname }: any) => {
    callback({ pid, pname });
  });
};

export const sendRTC = (id: string, type: string, desc: any): void => {
  socket.emit("rtc", { id, desc, type });
};

export const rtcIn = (callback: any): void => {
  socket.on("in-rtc", (data: any) => {
    callback(data);
  });
};
