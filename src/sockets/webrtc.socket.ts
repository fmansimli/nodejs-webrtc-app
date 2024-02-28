import type { Namespace, Server, Socket } from "socket.io";
import { Jwt } from "../services/jwt";

export const init = (io: Server) => {
  const nsp: Namespace = io.of("/webrtc");
  nsp.use(async (socket, next) => {
    try {
      const data: any = await Jwt.verifyAsync(socket.handshake.auth.token.split(" ")[1]);
      socket.data = {
        ids: new Set(),
        username: "User" + Math.random().toString().substring(13),
        ...data
      };

      next();
    } catch (error: any) {
      next(error);
    }
  });

  nsp.on("connection", (socket: Socket) => {
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

    socket.on("call", ({ sid }) => {
      socket.to(sid).emit("call", { id: socket.id, ...socket.data });
    });

    socket.on("answer-call", ({ sid, answer }) => {
      socket.to(sid).emit("answer-call", { id: socket.id, ...socket.data, answer });
    });

    socket.on("cancel-call", ({ id }, callback) => {
      socket.to(id).emit("cancel-call", { id: socket.id });
      callback();
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

    socket.on("join", (id: string, callback) => {
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
      if (type === "ready") {
        socket.data.ids.add(id);
      }
      nsp.to(id).emit("in-rtc", { desc, type });
    });

    socket.on("disconnect", () => {
      socket.to(Array.from(socket.data.ids)).emit("user-left", {
        id: socket.id
      });
    });

    socket.on("disconnecting", (_reason) => {});

    socket.on("get-info", async (_data, callback) => {
      try {
        const sockets = await nsp.in(socket.data.lang).fetchSockets();
        callback(sockets.map((socket) => ({ id: socket.id, ...socket.data })));
      } catch (error) {
        callback(0);
      }
    });

    socket.on("join-room", ({ room }, callback) => {
      try {
        socket.join(room);
        socket.data.ids.add(room);
        socket.to(room).emit("user-joined", { id: socket.id, ...socket.data });
        callback();
      } catch (error) {
        callback(0);
      }
    });

    socket.on("leave-room", ({ room }, callback) => {
      try {
        socket.leave(room);
        socket.to(room).emit("user-left", { id: socket.id });
        callback();
      } catch (error) {
        callback();
      }
    });

    socket.on("get-sockets", async ({ room }, callback) => {
      try {
        const sockets = await nsp.in(room).fetchSockets();
        callback(sockets.map((socket) => ({ id: socket.id, ...socket.data })));
      } catch (error) {
        callback(0);
      }
    });
  });
};
