import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users: " + err.message);
    }
  };

  useEffect(() => {
 if (!user) {
   // navigate("/"); // Redirect to homepage/login if not logged in
    return;
  }
      fetchUsers();

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
  console.log(users.role);

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      fetchUsers();
    } catch {
      setError("Failed to update user role.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      fetchUsers();
    } catch {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Users</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              {user?.role === "admin" && (
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{u.email}</td>
                <td className="px-6 py-4 text-sm capitalize text-gray-800">{u.role}</td>
                {user?.role === "admin" && (
                <td className="px-6 py-4 flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="client">Client</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                  >
                    Delete
                  </button>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
