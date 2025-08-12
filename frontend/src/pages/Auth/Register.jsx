import React, { useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";

const Register = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    employeeId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empID = localStorage.getItem("empID");

      const payload = {
        ...formData,
        createdBy: empID, // set dynamically
      };

      await axios.post("http://localhost:5000/api/auth/register", payload, {
        headers: { empID },
      });

      setSuccess("User registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        employeeId: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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

  // Define allowed roles dynamically
  let roleOptions = [];
  if (user.role === "superadmin") {
    roleOptions = ["admin"];
  } else if (user.role === "admin") {
    roleOptions = ["developer", "client"];
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register New User</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
