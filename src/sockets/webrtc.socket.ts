import type { Namespace, Server } from "socket.io";
import { Jwt } from "../services/jwt";

export const init = (io: Server) => {
  const nsp: Namespace = io.of("/webrtc");
  nsp.use(async (socket, next) => {
    try {
      const data: any = await Jwt.verifyAsync(socket.handshake.auth.token.split(" ")[1]);
      socket.data = data;

      next();
    } catch (error: any) {
      next(error);
    }
  });

  nsp.on("connection", async (socket) => {
    socket.on("random", async (_data, callback) => {
      try {
        const partners = await nsp.in(socket.data.lang).fetchSockets();
        const partner = partners[0];

        if (partner) {
          partner.leave(partner.data.lang);
          socket.to(partner.id).emit("hey", {
            pid: socket.id,
            pname: socket.data.username,
            deviceType: socket.data.deviceType,
            deviceName: socket.data.deviceName
          });
        } else {
          socket.join(socket.data.lang);
        }
        callback();
      } catch (error) {
        callback(error);
      }
    });

    socket.on("heyy", ({ pid }: any, callback: any) => {
      socket.to(pid).emit("heyy", {
        pid: socket.id,
        pname: socket.data.username,
        deviceType: socket.data.deviceType,
        deviceName: socket.data.deviceName
      });
      callback();
    });

    socket.on("join-room", (id: string, callback) => {
      const size = nsp.adapter.rooms.get(id)?.size;
      if (size && size >= 2) {
        return callback(false);
      }
      socket.join(id);
      callback(true);
    });

    socket.on("leave-room", (id: string) => {
      socket.leave(id);
    });

    socket.on("rtc", ({ id, type, desc }) => {
      nsp.to(id).emit("in-rtc", { desc, type });
    });

    socket.on("disconnect", () => {});
    socket.on("disconnecting", (_reason) => {});

    socket.on("info", async (_data, callback) => {
      try {
        const sockets = await nsp.in(socket.data.lang).fetchSockets();
        callback(sockets.map((socket) => socket.data));
      } catch (error) {
        callback(-1);
      }
    });
  });
};
