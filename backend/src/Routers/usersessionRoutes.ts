const express = require("express");
const router = express.Router();
import { Request, Response } from "express";
import { prisma } from "./mainRoute";
import authenticate from "../middleware/authenticate";

router.post(
  "/join/:sessionid",
  authenticate,
  async (
    req: Request & { user?: { id: number; name: string } },
    res: Response
  ) => {
    const { sessionid } = req.params;
    const sessionIdNumber = parseInt(sessionid, 10);
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (isNaN(sessionIdNumber)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    if (!userId || !userName) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const session = await prisma.sportSession.findUnique({
        where: { id: sessionIdNumber },
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.playersHave >= session.playersNeeded) {
        return res.status(400).json({ error: "Session is already full" });
      }

      const userSession = await prisma.userSession.create({
        data: {
          userId,
          sessionId: sessionIdNumber,
        },
      });

      const updatedPlayers = (session.players as string[]) || [];
      updatedPlayers.push(userName);

      await prisma.sportSession.update({
        where: { id: sessionIdNumber },
        data: {
          playersHave: session.playersHave + 1,
          playersNeeded: session.playersNeeded - 1,
          players: updatedPlayers,
        },
      });

      res.json({ success: true, userSession });
    } catch (error: any) {
      console.error("Error in join route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/leave/:sessionid",
  authenticate,
  async (
    req: Request & { user?: { id: number; name: string } },
    res: Response
  ) => {
    const { sessionid } = req.params;
    const sessionIdNumber = parseInt(sessionid, 10);
    const userId = req.user?.id;
    const userName = req.user?.name;

    if (isNaN(sessionIdNumber)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    if (!userId || !userName) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const session = await prisma.sportSession.findUnique({
        where: { id: sessionIdNumber },
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const userSession = await prisma.userSession.findFirst({
        where: {
          userId,
          sessionId: sessionIdNumber,
        },
      });

      if (!userSession) {
        return res.status(404).json({ error: "User session not found" });
      }

      await prisma.userSession.delete({
        where: { id: userSession.id },
      });

      const updatedPlayers = (session.players as string[]) || [];
      const playerIndex = updatedPlayers.indexOf(userName);
      if (playerIndex !== -1) {
        updatedPlayers.splice(playerIndex, 1);
      }

      await prisma.sportSession.update({
        where: { id: sessionIdNumber },
        data: {
          playersHave: session.playersHave - 1,
          playersNeeded: session.playersNeeded + 1,
          players: updatedPlayers,
        },
      });

      res.json({ success: true, message: "Session left successfully" });
    } catch (error: any) {
      console.error("Error in leave route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
