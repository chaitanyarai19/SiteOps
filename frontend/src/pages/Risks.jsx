import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Risks = () => {
  const { user } = useContext(AuthContext);
  const [risks, setRisks] = useState([]);
  const [formData, setFormData] = useState({
    riskId: "",
    summary: "",
    details: "",
    mitigationPlan: "",
    status: "New",
    priority: "Medium",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const token = localStorage.getItem("token");
      const empID = localStorage.getItem("empID");
      const res = await axios.get("http://localhost:5000/api/risks", {
        headers: { Authorization: `Bearer ${token}`, empID: empID },
      });
      setRisks(res.data);
    } catch (err) {
      console.error("Error fetching risks:", err);
      setError("Failed to load risks.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      riskId: "",
      summary: "",
      details: "",
      mitigationPlan: "",
      status: "New",
      priority: "Medium",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const empID = localStorage.getItem("empID");
      const payload = { ...formData, empID };
      if (editId) {
        await axios.put(`http://localhost:5000/api/risks/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/risks", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      fetchRisks();
    } catch (err) {
      console.error("Error saving risk:", err);
      setError("Failed to save risk.");
    }
  };

  const handleEdit = (risk) => {
    setFormData(risk);
    setEditId(risk._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/risks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRisks();
    } catch (err) {
      console.error("Error deleting risk:", err);
      setError("Failed to delete risk.");
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "New":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "Accept":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "Closed":
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return baseClasses;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (priority) {
      case "High":
        return `${baseClasses} bg-red-100 text-red-700`;
      case "Medium":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "Low":
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return baseClasses;
    }
  };

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
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📋 Risk Management</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {user?.role === "admin" && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="riskId"
              placeholder="Risk ID"
              value={formData.riskId}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="summary"
              placeholder="Risk Summary"
              value={formData.summary}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="details"
              placeholder="Risk Details"
              value={formData.details}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="mitigationPlan"
              placeholder="Mitigation Plan"
              value={formData.mitigationPlan}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Accept">Accept</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {editId ? "Update Risk" : "Add Risk"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📄 Submitted Risks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Risk ID</th>
                <th className="border px-4 py-2">Summary</th>
                <th className="border px-4 py-2">Details</th>
                <th className="border px-4 py-2">Mitigation</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Priority</th>
                {user?.role === "admin" && <th className="border px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {risks.length > 0 ? (
                risks.map((risk) => (
                  <tr key={risk._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{risk.riskId}</td>
                    <td className="border px-4 py-2">{risk.summary}</td>
                    <td className="border px-4 py-2">{risk.details}</td>
                    <td className="border px-4 py-2">{risk.mitigationPlan}</td>
                    <td className="border px-4 py-2">
                      <span className={getStatusBadge(risk.status)}>{risk.status}</span>
                    </td>
                    <td className="border px-4 py-2">
                      <span className={getPriorityBadge(risk.priority)}>{risk.priority}</span>
                    </td>
                    {user?.role === "admin" && (
                      <td className="border px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(risk)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(risk._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No risks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Risks;
