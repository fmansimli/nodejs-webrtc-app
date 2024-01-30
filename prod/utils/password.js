"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class Password {
    static async toHash(password, level = 10) {
        const salt = (0, crypto_1.randomBytes)(8).toString("hex");
        const buffer = (await scryptAsync(password, salt, level));
        return `${buffer.toString("hex")}.${salt}.${level}`;
    }
    static async compare(stored, plain) {
        const [hashed, salt, level] = stored.split(".");
        const buffer = (await scryptAsync(plain, salt, +level));
        return buffer.toString("hex") === hashed;
    }
}
exports.Password = Password;
