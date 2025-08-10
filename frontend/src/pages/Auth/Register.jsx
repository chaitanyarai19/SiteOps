import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";

const Register = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer", // default role
    employeeId: "",
    createdBy: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // 📤 Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empID = localStorage.getItem("empID");
      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          empID: empID, 
        },
      });
      setSuccess("User registered successfully!");
      setFormData({ name: "", email: "", password: "", role: "developer" , employeeId: "", createdBy: empID });
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
          >
            {user?.role === "superadmin" && (
              <option value="admin">Admin</option>
            )}
            {user?.role !== "superadmin" && (
              <>
               <option value="developer">Developer</option>
                <option value="client">Client</option>
                </>
            )}
           
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
