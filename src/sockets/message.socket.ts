import type { Namespace, Server } from "socket.io";
import { Jwt } from "../services/jwt";

export const init = (io: Server) => {
  const nsp: Namespace = io.of("/chat");

  nsp.use(async (socket, next) => {
    try {
      const data: any = await Jwt.verifyAsync(socket.handshake.auth.token.split(" ")[1]);

      if (!data?.username) {
        Object.assign(data, {
          username: "User" + Math.floor(Math.random() * 10000)
        });
      }
      socket.data = data;
      next();
    } catch (error: any) {
      next(error);
    }
  });

  nsp.on("connection", async (socket) => {
    socket.on("disconnect", () => {
      nsp.emit("user-left", socket.id);
    });

    socket.on("disconnecting", (_reason) => {
      nsp.emit("leaving", socket.id);
    });
  });
};
