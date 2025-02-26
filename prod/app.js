"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const config_1 = require("./config/config");
const error_1 = require("./middlewares/error");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
config_1.AppConfig.init();
app.use(express_1.default.json());
app.use(express_1.default.static((0, path_1.join)(process.cwd(), "./prod/public")));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: ["*"], optionsSuccessStatus: 200 }));
app.use("/api", routes_1.default);
app.use(error_1.catch404);
app.use(error_1.catchError);
exports.default = app;
