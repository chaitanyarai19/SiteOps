import React, { useEffect, useState } from "react";
import axios from "axios";


const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    site: "",
    title: "",
    description: "",
    ticketId: "",
  });
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Error fetching tickets. See console for details.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:5000/api/tickets", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ site: "", title: "", description: "", ticketId: "" });
      fetchTickets();
    } catch (err) {
      console.error("Error creating ticket:", err);
      if (err.response?.data?.message) {
        setError(`Failed to create ticket: ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setError(`Failed to create ticket: ${err.response.data.error}`);
      } else {
        setError("Failed to create ticket. See console for details.");
      }
    }
  };

  // const handleStatusChange = async (id, status) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/tickets/${id}`,
  //       { status },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     fetchTickets();
  //   } catch {
  //     setError("Failed to update ticket status.");
  //   }
  // };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      console.error("Error deleting ticket:", err);
      setError("Failed to delete ticket. See console for details.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tickets</h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Ticket Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-lg mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="site"
            placeholder="Site URL"
            value={formData.site}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Ticket Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />

          <input
            name="description"
            placeholder="Ticket Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />

          <input
            type="text"
            name="ticketId"
            placeholder="Ticket ID"
            value={formData.ticketId}
            onChange={handleChange}
            className="p-2 border rounded"
          />

        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Ticket
        </button>
      </form>

      {/* Ticket List */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Site</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Ticket ID</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="border-t">
              <td className="p-2">{ticket.site}</td>
              <td className="p-2">{ticket.title}</td>
              <td className="p-2">{ticket.description}</td>
              <td className="p-2">{ticket.ticketId}</td>
              <td className="p-2 space-x-2">
             
                    <button
                      onClick={() => handleDelete(ticket._id)}
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

export default Tickets;
