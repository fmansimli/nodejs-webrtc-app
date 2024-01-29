import { Server } from "socket.io";
import * as webRTC from "./webrtc.socket";
import * as message from "./message.socket";

let io: any;

export const initialize = (http: any) => {
  io = new Server(http, {
    cors: {
      origin: ["*"],
      methods: ["POST", "GET"],
      credentials: true
    },
    transports: ["websocket", "polling"]
  });

  webRTC.init(io);
  message.init(io);
};
