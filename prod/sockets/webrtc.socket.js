"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const jwt_1 = require("../services/jwt");
const init = (io) => {
    const nsp = io.of("/webrtc");
    nsp.use(async (socket, next) => {
        try {
            const data = await jwt_1.Jwt.verifyAsync(socket.handshake.auth.token.split(" ")[1]);
            socket.data = Object.assign({ ids: new Set() }, data);
            next();
        }
        catch (error) {
            next(error);
        }
    });
    nsp.on("connection", (socket) => {
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
                }
                else {
                    socket.join(socket.data.lang);
                }
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
        socket.on("call", ({ sid }) => {
            socket.to(sid).emit("call", Object.assign({ id: socket.id }, socket.data));
        });
        socket.on("answer-call", ({ sid, answer }) => {
            socket.to(sid).emit("answer-call", Object.assign(Object.assign({ id: socket.id }, socket.data), { answer }));
        });
        socket.on("heyy", ({ pid }, callback) => {
            socket.to(pid).emit("heyy", {
                pid: socket.id,
                pname: socket.data.username,
                deviceType: socket.data.deviceType,
                deviceName: socket.data.deviceName
            });
            callback();
        });
        socket.on("join", (id, callback) => {
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
        socket.on("disconnecting", (_reason) => { });
        socket.on("get-info", async (_data, callback) => {
            try {
                const sockets = await nsp.in(socket.data.lang).fetchSockets();
                callback(sockets.map((socket) => (Object.assign({ id: socket.id }, socket.data))));
            }
            catch (error) {
                callback(0);
            }
        });
        socket.on("join-room", ({ room }, callback) => {
            try {
                socket.join(room);
                socket.data.ids.add(room);
                socket.to(room).emit("user-joined", Object.assign({ id: socket.id }, socket.data));
                callback();
            }
            catch (error) {
                callback(0);
            }
        });
        socket.on("leave-room", ({ room }, callback) => {
            try {
                socket.leave(room);
                socket.to(room).emit("user-left", { id: socket.id });
                callback();
            }
            catch (error) {
                callback();
            }
        });
        socket.on("get-sockets", async ({ room }, callback) => {
            try {
                const sockets = await nsp.in(room).fetchSockets();
                callback(sockets.map((socket) => (Object.assign({ id: socket.id }, socket.data))));
            }
            catch (error) {
                callback(0);
            }
        });
    });
};
exports.init = init;
