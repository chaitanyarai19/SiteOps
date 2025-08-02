import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    sites: 0,
    tickets: 0,
    users: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.data?.message) {
          setError(`Failed to load dashboard data: ${err.response.data.message}`);
        } else {
          setError("Failed to load dashboard data. See console for details.");
        }
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.name} 👋</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Sites</h2>
          <p className="text-3xl font-bold">{stats.sites}</p>
        </div>

        <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Tickets</h2>
          <p className="text-3xl font-bold">{stats.tickets}</p>
        </div>

        {/* {user?.role === "admin" && ( */}
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Dashboard;
