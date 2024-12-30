const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "./mainRoute";
import authenticate from "../middleware/authenticate";

router.post("/join/:sessionid", async (req: Request, res: Response) => {
  const { sessionid } = req.params;
  const sessionIdNumber = parseInt(sessionid, 10);

  if (isNaN(sessionIdNumber)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const session = await prisma.sportSession.findUnique({
      where: { id: sessionIdNumber },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionId: session.id,
      },
    });

    res.json({ success: true, userSession });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error });
  }
});

router.delete(
  "/leave/:sessionid",
  authenticate,
  async (req: Request & { user?: { id: number } }, res: Response) => {
    const { sessionid } = req.params;
    const sessionIdNumber = parseInt(sessionid, 10);
    const userId1 = req.user?.id;

    if (isNaN(sessionIdNumber)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    if (!userId1) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const userSession = await prisma.userSession.findFirst({
        where: {
          userId: userId1,
          sessionId: sessionIdNumber,
        },
      });

      if (!userSession) {
        return res.status(404).json({ error: "User session not found" });
      }

      await prisma.userSession.delete({
        where: { id: userSession.id },
      });

      res.json({ success: true, message: "Session left successfully" });
    } catch (error: any) {
      console.error("Error in leave route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
