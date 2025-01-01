import { Link } from "react-router-dom";
import Appbar from "../components/Appbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/Config";

interface Sport {
  sportName: string;
  id: number;
}

const Dashboard = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateSport, setShowCreateSport] = useState(false);
  const [newSportName, setNewSportName] = useState("");

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/admin/getsports`);
        if (res.status !== 200) {
          throw new Error("Failed to fetch sports");
        }
        setSports(res.data);
      } catch (error: any) {
        console.log("Error while fetching sports: ", error);
      }
    };

    const checkAdmin = () => {
      const name = localStorage.getItem("name");
      setIsAdmin(name === "Admin");
    };

    fetchSports();
    checkAdmin();
  }, [loading]);

  const handleCreateSport = async () => {
    setloading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/admin/createsport`,
        { name: newSportName },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (res.status === 201) {
        setSports([...sports, res.data]);

        setShowCreateSport(false);
      }
      setNewSportName("");
      setloading(false);
    } catch (error: any) {
      console.log("Error while creating sport: ", error);
    }
  };

  return (
    <div className="min-h-screen">
      <Appbar />
      <section className="container mx-auto mt-10 px-6 flex flex-col md:flex-row items-center">
        <div className="flex flex-col w-full">
          {isAdmin && (
            <div className="mb-6 w-full">
              <button
                className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 mb-4"
                onClick={() => setShowCreateSport(!showCreateSport)}
              >
                {showCreateSport ? "Cancel" : "Create Sport"}
              </button>
              {showCreateSport && (
                <div className="bg-white shadow-md rounded-md p-4 mt-4">
                  <input
                    type="text"
                    value={newSportName}
                    onChange={(e) => setNewSportName(e.target.value)}
                    placeholder="Enter sport name"
                    className="border px-4 py-2 rounded-md w-full mb-4"
                  />
                  <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                    onClick={handleCreateSport}
                  >
                    Create
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-10 w-full">
            {sports.map((sport) => (
              <div
                key={sport.id}
                className="bg-white shadow-md rounded-md h-full"
              >
                <div className="flex justify-between items-center p-4">
                  <h2 className="text-2xl font-bold">{sport.sportName}</h2>
                  <div className="flex space-x-4 items-center">
                    <Link
                      to={`/sport/${sport.id}`}
                      className="text-gray-700 hover:text-yellow-500"
                    >
                      View Sessions
                    </Link>
                    <Link
                      to={`/sport/create/${sport.id}`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Create Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
