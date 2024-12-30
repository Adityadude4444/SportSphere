const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "./mainRoute";

router.post("/createsession", async (req: Request, res: Response) => {
  const {
    sportId,
    creatorId,
    date,
    time,
    venue,
    additionalPlayers,
    existingPlayers,
    name,
  } = req.body;

  try {
    if (
      !sportId ||
      !creatorId ||
      !date ||
      !time ||
      !venue ||
      !additionalPlayers ||
      !name
    ) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const session = await prisma.sportSession.create({
      data: {
        name,
        sportId,
        userId: creatorId,
        date: new Date(date),
        startTime: time,
        venue,
        playersHave: 0,
        playersNeeded: additionalPlayers,
        players: existingPlayers,
        cancellationStatus: false,
        cancellationReason: "",
      },
    });

    res.json({
      sessionId: session.id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getsessions", async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.sportSession.findMany();
    res.json(sessions);
  } catch (error) {
    res.json({ error });
  }
});

router.put("/cancel/:sessionid", async (req: Request, res: Response) => {
  const { sessionid } = req.params;
  const { cancellationReason } = req.body;
  const sessionIdNumber = parseInt(sessionid, 10);

  if (isNaN(sessionIdNumber)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  if (!cancellationReason) {
    return res.status(400).json({ error: "Cancellation reason is required" });
  }

  try {
    const session = await prisma.sportSession.findUnique({
      where: { id: sessionIdNumber },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const updatedSession = await prisma.sportSession.update({
      where: { id: sessionIdNumber },
      data: {
        cancellationStatus: true,
        cancellationReason,
      },
    });

    res.json({ success: true, updatedSession });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
