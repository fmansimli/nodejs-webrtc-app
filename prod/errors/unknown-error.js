"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = void 0;
const custom_error_1 = require("./custom-error");
class UnknownError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.httpCode = 500;
        Object.setPrototypeOf(this, UnknownError.prototype);
    }
    serialize() {
        return {
            httpCode: this.httpCode,
            message: this.message
        };
    }
}
exports.UnknownError = UnknownError;
