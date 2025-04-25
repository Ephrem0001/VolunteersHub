import { useEffect, useState } from "react";

const ApproveEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/events/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch pending events");

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching pending events:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateEventStatus = async (id, status) => {
    try {
      const endpoint = `http://localhost:5000/api/events/${status}/${id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${status} event`);
      }
  
      const result = await response.json();
      alert(result.message);
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (error) {
      console.error(`Error ${status} event:`, error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Approve/Reject NGO Event Posts</h2>

      {loading && <p className="text-blue-500 mb-4">Loading events...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Event Name</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Location</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No pending events</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{event.name}</td>
                  <td className="px-4 py-3 border-b">{event.description}</td>
                  <td className="px-4 py-3 border-b">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b">{event.location}</td>
                  <td className="px-4 py-3 border-b">{event.status}</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                        onClick={() => updateEventStatus(event._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                        onClick={() => updateEventStatus(event._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ApproveEvents;
