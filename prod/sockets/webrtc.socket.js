"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const jwt_1 = require("../services/jwt");
const init = (io) => {
    const nsp = io.of("/webrtc");
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
        socket.on("random", async (_data, _callback) => {
            try {
                const partners = await nsp.in(socket.data.lang).fetchSockets();
                const partner = partners[0];
                if (partner) {
                    partner.leave(partner.data.lang);
                    socket.to(partner.id).emit("hey", { pid: socket.id, pname: socket.data.username });
                }
                else {
                    socket.join(socket.data.lang);
                }
                _callback();
            }
            catch (error) {
                _callback(error);
            }
        });
        socket.on("heyy", ({ pid }, callback) => {
            socket.to(pid).emit("heyy", { pid: socket.id, pname: socket.data.username });
            callback();
        });
        socket.on("join-room", (id, callback) => {
            var _a;
            const size = (_a = nsp.adapter.rooms.get(id)) === null || _a === void 0 ? void 0 : _a.size;
            if (size && size >= 2) {
                return callback(false);
            }
            socket.join(id);
            callback(true);
        });
        socket.on("leave-room", (id) => {
            socket.leave(id);
        });
        socket.on("rtc", ({ id, type, desc }) => {
            nsp.to(id).emit("in-rtc", { desc, type });
        });
        socket.on("disconnect", () => {
            nsp.emit("leaving", socket.id);
        });
        socket.on("disconnecting", (_reason) => {
        });
    });
};
exports.init = init;
