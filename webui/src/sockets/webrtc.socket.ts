import { type Socket, io } from "socket.io-client";

export let socket: Socket;
const BASE_URL = import.meta.env.VITE_HOST_URL;

export const initWebRTC = (token: string, callback: (succeed: boolean) => void) => {
  if (socket?.connected) {
    return callback(true);
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
    callback(true);
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    } else {
      callback(false);
    }
  });

  socket.on("connect_error", (_error) => {
    callback(false);
  });

  socket.on("unauthorized", (_data) => {});
  socket.on("success", (_data) => {});
};

export const disconnect = (callback: (succeed: boolean) => void): void => {
  try {
    if (socket?.connected) {
      socket.disconnect();
    }
    socket?.removeAllListeners();
    callback(true);
  } catch (error) {
    callback(false);
  }
};

export const reconnect = (): void => {
  if (socket?.disconnected) {
    socket.connect();
  }
};

export const joinGlobal = (callback: (data?: any) => void) => {
  socket.emit("random", {}, (data: any) => {
    callback(data);
  });
};

export const heyIn = (callback: (data: any) => void) => {
  socket.on("hey", ({ pid, pname, deviceType, deviceName }: any) => {
    socket.emit("heyy", { pid }, () => {
      callback({ pid, pname, deviceType, deviceName });
    });
  });
};

export const replyIn = (callback: (data: any) => void) => {
  socket.on("heyy", ({ pid, pname, deviceType, deviceName }: any) => {
    callback({ pid, pname, deviceType, deviceName });
  });
};

export const sendRTC = (id: string, type: string, desc: any): void => {
  socket.emit("rtc", { id, desc, type });
};

export const rtcIn = (callback: any): void => {
  try {
    socket.on("in-rtc", (data: any) => {
      callback(data);
    });
  } catch (error) {
    console.error(error);
  }
};

export const getInfo = (callback: (resp: any) => void) => {
  socket.emit("info", {}, (_data: any) => {
    callback(_data);
  });
};
