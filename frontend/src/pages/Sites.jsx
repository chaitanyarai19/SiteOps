import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';


const Sites = () => {
  useContext(AuthContext);
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
      });
      setSites(res.data);
    } catch {
      setError("Failed to load sites.");
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/sites/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/sites", formData, {
          headers: { Authorization: `Bearer ${token}` },
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
      });
      fetchSites();
    } catch {
      setError("Failed to delete site.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Sites</h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Site Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Website Location"
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
            <option value={formData.status}>{formData.status}</option>
            <option value="maintenance">Maintenance</option>
            <option value="active">Active</option>
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

      {/* Site List Table */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-2">URL</th>
            <th className="text-left p-2">Client</th>
            <th className="text-left p-2">Description</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site._id} className="border-t">
              <td className="p-2">{site.location}</td>
              <td className="p-2">{site.name}</td>
              <td className="p-2">{site.description}</td>
              <td className="p-2 capitalize">{site.status}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(site)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(site._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sites;
