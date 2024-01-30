"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiv1_1 = __importDefault(require("./apiv1"));
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
router.use("/v1", apiv1_1.default);
router.use("/admin", admin_1.default);
exports.default = router;
