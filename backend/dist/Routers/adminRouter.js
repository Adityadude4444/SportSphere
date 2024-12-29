"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const mainRoute_1 = require("./mainRoute");
router.post("/createsport", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ error: "Sport name is required" });
            return;
        }
        const sport = yield mainRoute_1.prisma.sport.create({
            data: {
                name: name,
            },
        });
        res.json({
            sportId: sport.id,
        });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
router.get("/getsports", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sports = yield mainRoute_1.prisma.sport.findMany();
        res.json(sports);
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
exports.default = router;
