import React, { useState } from "react";
import Appbar from "../components/Appbar";
import { Labelbox } from "../components/minicomponents/Labelbox";
import axios from "axios";
import { BACKEND_URL } from "../config/Config";
import { useParams } from "react-router-dom";

interface FormData {
  name: string;
  date: string;
  time: string;
  venue: string;
  additionalPlayers: number;
  existingPlayers: string[];
}

const Createsession = () => {
  const { sportid } = useParams<{ sportid: string }>();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    date: "",
    time: "",
    venue: "",
    additionalPlayers: 0,
    existingPlayers: [],
  });

  const handleChange = (
    field: keyof FormData,
    value: string | number | string[]
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCreateSession = async () => {
    if (!sportid) {
      console.error("Sport ID is missing");
      return;
    }

    const { name, date, time, venue, additionalPlayers, existingPlayers } =
      formData;

    if (!name || !date || !time || !venue || additionalPlayers <= 0) {
      alert(
        "All fields are required and additional players must be greater than 0."
      );
      return;
    }

    const trimmedPlayers = existingPlayers.map((player) => player.trim());
    if (trimmedPlayers.some((player) => !player)) {
      alert("Existing players cannot have empty names.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/session/createsession/${sportid}`,
        {
          name,
          date,
          time,
          venue,
          additionalPlayers,
          existingPlayers: trimmedPlayers,
        },
        { headers: { Authorization: token }, withCredentials: true }
      );
      console.log("Session created:", response.data);
      alert("Session created successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Session created successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar />
      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Create Session</h1>
        <div className="flex justify-center">
          <div className="bg-white shadow-md rounded-lg flex flex-col p-5 w-96 justify-center ">
            <Labelbox
              label="Name"
              placeholder="Enter session name"
              onchange={(e) => handleChange("name", e.target.value)}
            />
            <Labelbox
              label="Date"
              placeholder="2025-01-01"
              type="date"
              onchange={(e) => handleChange("date", e.target.value)}
            />
            <Labelbox
              label="Time"
              placeholder="14:00"
              type="time"
              onchange={(e) => handleChange("time", e.target.value)}
            />
            <Labelbox
              label="Venue"
              placeholder="Enter venue"
              onchange={(e) => handleChange("venue", e.target.value)}
            />
            <Labelbox
              label="Additional Players"
              placeholder="Enter number of additional players"
              type="number"
              onchange={(e) =>
                handleChange("additionalPlayers", parseInt(e.target.value, 10))
              }
            />
            <Labelbox
              label="Existing Players"
              placeholder="Enter player names separated by commas"
              onchange={(e) => {
                const players = e.target.value
                  .split(",")
                  .map((name) => name.trim())
                  .filter((name) => name !== "");
                handleChange("existingPlayers", players);
              }}
            />

            <button
              onClick={handleCreateSession}
              className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all max-w-sm"
            >
              Create Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createsession;
