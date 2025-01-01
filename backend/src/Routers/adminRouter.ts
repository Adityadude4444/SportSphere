const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "./mainRoute";

router.post("/createsport", async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({ error: "Sport name is required" });
      return;
    }
    const sport = await prisma.sport.create({
      data: {
        sportName: name,
      },
    });
    res.json({
      sportId: sport.id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getsports", async (req: Request, res: Response) => {
  try {
    const sports = await prisma.sport.findMany();
    res.json(sports);
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.get("/reports", async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.sportSession.findMany();
    res.json(sessions);
  } catch (error) {
    res.json({ error });
  }
});

export default router;
