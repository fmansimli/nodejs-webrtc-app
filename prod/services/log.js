"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static error(error) {
        console.error("CUSTOM_LOGGER:", error);
    }
    static log(data) {
        console.log("CUSTOM_LOGGER:", data);
    }
}
exports.Logger = Logger;
