import { data, useNavigate } from "react-router-dom";
import { SportSession } from "../pages/Sportsessions";
import axios from "axios";
import { BACKEND_URL } from "../config/Config";

const Session = ({
  id,
  name,
  players,
  playersNeeded,
  startTime,
  venue,
  date,
  cancellationStatus,
  cancellationReason,
  userId,
}: SportSession) => {
  const uid = Number(localStorage.getItem("userId")) || 0;

  const navigate = useNavigate();

  const handleCancel = () => {
    const reason = prompt("Please provide a cancellation reason:");
    if (reason) {
      console.log(`Cancellation reason: ${reason}`);
      axios.put(`${BACKEND_URL}/api/v1/session/cancel/${id}`, {
        cancellationReason: reason,
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>
      <div className="text-gray-600 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Players Needed:</span>
          <span>{playersNeeded}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Start Time:</span>
          <span>
            {new Date(startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Venue:</span>
          <span>{venue}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Cancellation:</span>
          <span
            className={`font-medium ${
              cancellationStatus ? "text-red-500" : "text-green-500"
            }`}
          >
            {cancellationStatus ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Created By:</span>
          <span>{uid === userId ? "You" : `User ID: ${userId}`}</span>
        </div>
        <div className="flex gap-2">
          {uid === userId && cancellationReason === "" && (
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 mt-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 mt-4"
            onClick={() => {
              navigate(`/session/${id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Session;
