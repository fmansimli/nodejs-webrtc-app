"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const jwt_1 = require("../services/jwt");
const init = (io) => {
    const nsp = io.of("/chat");
    nsp.use(async (socket, next) => {
        try {
            const data = await jwt_1.Jwt.verifyAsync(socket.handshake.auth.token.split(" ")[1]);
            if (!(data === null || data === void 0 ? void 0 : data.username)) {
                Object.assign(data, {
                    username: "User" + Math.floor(Math.random() * 10000)
                });
            }
            socket.data = data;
            next();
        }
        catch (error) {
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
exports.init = init;
