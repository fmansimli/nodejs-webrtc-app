"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res, _next) => {
    try {
        res.status(200).json({
            env: process.env.NODE_ENV,
            url: req.originalUrl,
            ip: req.ip
        });
    }
    catch (error) {
        _next(error);
    }
});
exports.default = router;
