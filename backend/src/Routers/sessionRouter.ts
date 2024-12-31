const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "./mainRoute";
import authenticate from "../middleware/authenticate";
router.use(express.json());
router.post(
  "/createsession/:sportid",
  authenticate,
  async (
    req: Request & { user?: { id: number; name: string } },
    res: Response
  ) => {
    const { date, time, venue, additionalPlayers, existingPlayers, name } =
      req.body;

    try {
      const sportId = req.params.sportid;
      const creatorId = req.user?.id;
      if (
        !sportId ||
        !creatorId ||
        !date ||
        !time ||
        !venue ||
        !additionalPlayers ||
        !name
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const parsedDateTime = new Date(`${date}T${time}:00Z`);
      if (isNaN(parsedDateTime.getTime())) {
        return res.status(400).json({ error: "Invalid time format" });
      }

      const session = await prisma.sportSession.create({
        data: {
          name,
          sportId: Number(sportId),
          userId: Number(creatorId),
          date: parsedDate,
          startTime: parsedDateTime,
          venue,
          playersHave: 0,
          playersNeeded: Number(additionalPlayers),
          players: existingPlayers,
          cancellationStatus: false,
          cancellationReason: "",
        },
      });

      res.status(201).json({
        sessionId: session.id,
      });
    } catch (error: any) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
);

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
