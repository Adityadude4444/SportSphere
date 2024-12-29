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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
exports.prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.use(express_1.default.json());
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.use("/admin", adminRouter_1.default);
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const user = yield exports.prisma.user.create({
            data: {
                email,
                password,
                name,
            },
        });
        res.json({
            userId: user.id,
        });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const user = yield exports.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(400).json({ error: "Invalid Credentials" });
            return;
        }
        const passwordMatch = (yield user.password) === password;
        if (!passwordMatch) {
            res.status(400).json({ error: "Invalid Credentials" });
            return;
        }
        const token = jwt.sign(user.id, process.env.JWT_SECRET);
        localStorage.setItem("token", token);
        res.json({
            token,
            userId: user.id,
        });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
exports.default = router;
