"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const custom_error_1 = require("./custom-error");
class ForbiddenError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.httpCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serialize() {
        return {
            httpCode: this.httpCode,
            message: this.message
        };
    }
}
exports.ForbiddenError = ForbiddenError;
