import Appbar from "./Appbar";
import { useEffect, useState } from "react";
import { SportSession } from "../pages/Sportsessions";
import axios from "axios";
import { BACKEND_URL } from "../config/Config";
import { useParams } from "react-router-dom";

const Getinfosession = () => {
  const { id } = useParams();
  const [session, setSession] = useState<SportSession | null>(null);
  const [loading, setloading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const onjoin = async () => {
    setloading(true);
    try {
      const username = localStorage.getItem("name");
      const join = await axios.post(
        `${BACKEND_URL}/api/v1/usersession/join/${id}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      // Refresh session data
      const updatedSession = await axios.get(
        `${BACKEND_URL}/api/v1/session/sessionid/${id}`
      );

      setSession(updatedSession.data.session);

      // Check if the user is in the players array
      if (updatedSession.data.session.players.includes(username)) {
        setIsJoined(true);
      }

      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/session/sessionid/${id}`
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch session");
        }
        setSession(res.data.session);
        const username = localStorage.getItem("name");
        if (res.data.session.players.includes(username)) {
          setIsJoined(true);
        } else {
          setIsJoined(false);
        }
      } catch (error: any) {
        console.log("Error while fetching session: ", error);
      }
    };
    fetchSession();
  }, [id, loading]);

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  const isSessionFull = session.players.length >= session.playersNeeded;
  const onleave = async () => {
    setloading(true);
    try {
      const leave = await axios.delete(
        `${BACKEND_URL}/api/v1/usersession/leave/${id}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(leave);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar />
      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Session Details</h1>
        <div className="flex justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {session.name}
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-medium">Players:</span>{" "}
                {session.players.join(", ")}
              </p>
              <p>
                <span className="font-medium">Players Needed:</span>{" "}
                {session.playersNeeded}
              </p>
              <p>
                <span className="font-medium">Start Time:</span>{" "}
                {new Date(session.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <p>
                <span className="font-medium">Venue:</span> {session.venue}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(session.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Cancellation Status:</span>{" "}
                <span
                  className={`font-medium ${
                    session.cancellationStatus
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {session.cancellationStatus ? "Yes" : "No"}
                </span>
              </p>
              {session.cancellationStatus && (
                <p>
                  <span className="font-medium">Cancellation Reason:</span>{" "}
                  {session.cancellationReason}
                </p>
              )}
              <p>
                <span className="font-medium">Created By User ID:</span>{" "}
                {session.userId}
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              {!isSessionFull ? (
                isJoined ? (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={onleave}
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={onjoin}
                  >
                    Join
                  </button>
                )
              ) : (
                <p className="text-red-500 font-medium">Session is full</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Getinfosession;
