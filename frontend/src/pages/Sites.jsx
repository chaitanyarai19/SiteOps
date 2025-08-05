import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

const Sites = () => {
  const { user } = useContext(AuthContext);
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    location: "",
    name: "",
    description: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sites", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSites(res.data);
    } catch {
      setError("Failed to load sites.");
    }
  };

useEffect(() => {
  if (!user) {
   // navigate("/"); // Redirect to homepage/login if not logged in
    return;
  }
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
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/sites/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      } else {
        await axios.post("http://localhost:5000/api/sites", formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      }

      setFormData({ location: "", name: "", description: "", status: "active" });
      setEditId(null);
      fetchSites();
    } catch {
      setError("Failed to save site.");
    }
  };

  const handleEdit = (site) => {
    setFormData({
      location: site.location,
      name: site.name,
      description: site.description,
      status: site.status,
    });
    setEditId(site._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/sites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      fetchSites();
    } catch {
      setError("Failed to delete site.");
    }
  };

  return (
    <div className="p-6 relative">

      <h2 className="text-2xl font-semibold mb-4">Manage Sites</h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Site Form */}
      {user?.role === "admin" && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Website Url"
              value={formData.location}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="Client Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Enter Details of Site"
              value={formData.description}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="down">Down</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editId ? "Update Site" : "Add Site"}
          </button>
        </form>
      )}

      {/* Site List */}
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
          <tr>
            <th className="text-left px-4 py-3 text-gray-700 font-semibold">URL</th>
            <th className="text-left px-4 py-3 text-gray-700 font-semibold">Client</th>
            <th className="text-left px-4 py-3 text-gray-700 font-semibold">Description</th>
            <th className="text-left px-4 py-3 text-gray-700 font-semibold">Status</th>
            {user?.role === "admin" && (
              <th className="text-left px-4 py-3 text-gray-700 font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sites.map((site, index) => (
            <tr
              key={site._id}
              className={
                index % 2 === 0
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }
            >
              <td className="px-4 py-3 text-blue-600 underline">{site.location}</td>
              <td className="px-4 py-3">{site.name}</td>
              <td className="px-4 py-3">{site.description}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    site.status === "active"
                      ? "bg-green-100 text-green-800"
                      : site.status === "maintenance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {site.status}
                </span>
              </td>
              {user?.role === "admin" && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(site)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(site._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded shadow"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sites;
