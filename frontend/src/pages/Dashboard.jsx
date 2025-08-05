import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ sites: 0, tickets: 0, users: 0, files: 0 });
  const [error, setError] = useState("");
  const [empID, setEmpID] = useState("");

  useEffect(() => {
       const idFromCookie = Cookies.get("empID");
    if (idFromCookie) {
      setEmpID(idFromCookie);
    }
    const fetchStats = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch all counts in parallel
        const [sitesRes, ticketsRes, usersRes, filesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sites", config),
          axios.get("http://localhost:5000/api/tickets", config),
          axios.get("http://localhost:5000/api/users", config),
          axios.get("http://localhost:5000/api/files", config),
        ]);

        function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove non-alphanumeric characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}


        setStats({
          sites: sitesRes.data.length || 0,
          tickets: ticketsRes.data.length || 0,
          users: usersRes.data.length || 0,
          files: filesRes.data.length || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      }
    };

    fetchStats();
  }, [user]);
console.log('Dashboard accessed by employee ID:', empID);
  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">
          🚫 You don’t have access. Please login to continue.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name} ({user.role.charAt(0).toUpperCase() + user.role.slice(1)}) 👋</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <a href="/sites">
          <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Sites</h2>
            <p className="text-3xl font-bold">{stats.sites}</p>
          </div>
        </a>
        <a href="/tickets">
          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Risks</h2>
            <p className="text-3xl font-bold">{stats.tickets}</p>
          </div>
        </a>
        <a href="/users">
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
        </a>
        <a href="/files">
          <div className="bg-purple-100 text-purple-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Files</h2>
            <p className="text-3xl font-bold">{stats.files}</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
