import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import adminRouter from "./adminRouter";
import sessionRouter from "./sessionRouter";
import usersessionRouter from "./usersessionRoutes";
export const prisma = new PrismaClient();

const router = express.Router();
router.use(express.json());
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.use("/admin", adminRouter);
router.use("/session", sessionRouter);
router.use("/usersession", usersessionRouter);
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ error: "Invalid Credentials" });
      return;
    }
    const passwordMatch = (await user.password) === password;
    if (!passwordMatch) {
      res.status(400).json({ error: "Invalid Credentials" });
      return;
    }
    const id = user.id;
    const token = jwt.sign({ id, name: user.name }, process.env.JWT_SECRET);
    res.json({
      token,
      userId: user.id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

export default router;
