"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("./User"));
const post_1 = __importDefault(require("./post"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/user", User_1.default);
mainRouter.use("/posts", post_1.default);
exports.default = mainRouter;
