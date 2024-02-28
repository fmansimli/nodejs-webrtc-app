"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.createJwtKey = void 0;
const jwt_1 = require("../services/jwt");
const createJwtKey = async (req, res, next) => {
    const { lang, deviceType, deviceName } = req.body;
    try {
        const jwtKey = await jwt_1.Jwt.signKey({ lang, deviceType, deviceName });
        res.status(200).json({ jwt: jwtKey });
    }
    catch (error) {
        next(error);
    }
};
exports.createJwtKey = createJwtKey;
const test = async (req, res, next) => {
    try {
        res.status(200).json({ test: true });
    }
    catch (error) {
        next(error);
    }
};
exports.test = test;
