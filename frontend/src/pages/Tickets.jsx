import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    site: "",
    description: "",
  });

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sites", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSites(res.data);
    } catch (err) {
      console.error("Error fetching sites:", err);
    }
  };

  useEffect(() => {
      if (!user) {
   // navigate("/"); // Redirect to homepage/login if not logged in
    return;
  }
    fetchTickets();
    fetchSites();
  }, [user]);

    if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">
          🚫 You don’t have access. Please login to continue.
        </h1>
      </div>
    );
  }

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/tickets", formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      console.log("Ticket submitted:", res.data);
      setFormData({ title: "", site: "", description: "" });
      fetchTickets();
    } catch (err) {
      console.error("Error submitting ticket:", err);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      fetchTickets();
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-12">
        <h2 className="text-2xl font-semibold mb-12">Save a Ticket</h2>
        {user?.role === "admin" && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xxl">
          <input 
            type="text"
            name="title"
            placeholder="Issue Type"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />  

          <select
            name="site"
            value={formData.site}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Site</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site.location}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Describe your issue..."
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Ticket
          </button>
        </form>
        )}

        <h2 className="text-2xl font-semibold my-6">Submitted Tickets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Issue Type</th>
                <th className="p-3 text-left">Site</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t border-gray-200">
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">
                    {sites.find((s) => s._id === ticket.site)?.location || ticket.site}
                  </td>
                  <td className="p-3">{ticket.description}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
