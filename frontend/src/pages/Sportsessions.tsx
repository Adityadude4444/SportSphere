import axios from "axios";
import { BACKEND_URL } from "../config/Config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Session from "../components/Session";
import Appbar from "../components/Appbar";
export interface SportSession {
  id: number;
  name: string;
  players: string[];
  playersNeeded: number;
  startTime: string;
  venue: string;
  date: string;
  cancellationStatus: boolean;
  cancellationReason: string;
  userId: number;
}
const Sportsessions = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState<SportSession[]>([]);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/session/${id}`);
        if (res.status !== 200) {
          throw new Error("Failed to fetch sessions");
        }
        setSessions(res.data.sessions);
      } catch (error: any) {
        console.log("Error while fetching sessions: ", error);
      }
    };
    fetchSessions();
  }, [sessions]);
  return (
    <div className=" min-h-screen flex flex-col">
      <Appbar />
      <div className="grid grid-cols-4 gap-5 max-w-7xl mt-8 ml-8 w-screen items-center">
        {sessions.map((session) => (
          <Session
            id={session.id}
            name={session.name}
            players={session.players}
            playersNeeded={session.playersNeeded}
            startTime={session.startTime}
            venue={session.venue}
            date={session.date}
            cancellationStatus={session.cancellationStatus}
            cancellationReason={session.cancellationReason}
            userId={session.userId}
          />
        ))}
      </div>
    </div>
  );
};

export default Sportsessions;
