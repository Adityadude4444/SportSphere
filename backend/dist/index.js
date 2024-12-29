"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mainRoute_1 = __importDefault(require("./Routers/mainRoute"));
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", mainRoute_1.default);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
