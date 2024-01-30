"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const custom_error_1 = require("./custom-error");
class UnauthorizedError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.httpCode = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serialize() {
        return {
            httpCode: this.httpCode,
            message: this.message
        };
    }
}
exports.UnauthorizedError = UnauthorizedError;
