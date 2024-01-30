"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const custom_error_1 = require("./custom-error");
class ServerError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.httpCode = 500;
        Object.setPrototypeOf(this, ServerError.prototype);
    }
    serialize() {
        return {
            httpCode: this.httpCode,
            message: this.message
        };
    }
}
exports.ServerError = ServerError;
