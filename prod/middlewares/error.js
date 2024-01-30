"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.catch404 = void 0;
const custom_error_1 = require("../errors/custom-error");
const path_1 = require("path");
const catch404 = async (req, res, next) => {
    try {
        res.status(404).sendFile((0, path_1.join)(process.cwd(), "./prod/public/index.html"));
    }
    catch (error) {
        next(error);
    }
};
exports.catch404 = catch404;
const catchError = (err, req, res, _next) => {
    try {
        if (err instanceof custom_error_1.CustomError) {
            return res.status(err.httpCode).json(err.serialize());
        }
        res.status(500).json({
            httpCode: 500,
            message: "something went wrong",
            errors: err
        });
    }
    catch (error) {
        res.status(500).json({
            httpCode: 500,
            message: "unknown error"
        });
    }
    finally {
        console.log(err);
    }
};
exports.catchError = catchError;
