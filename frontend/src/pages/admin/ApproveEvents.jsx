import { useState } from "react";

const ApproveEvents = ({ events, setEvents, refreshEvents }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateEventStatus = async (id, status, ngoEmail) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = `http://localhost:5000/api/events/${status}/${id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
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
      
      // Option 1: Filter locally (faster UI update)
      setEvents(prev => prev.filter(event => event._id !== id));
      
      // Option 2: Refresh from server (more accurate)
      // refreshEvents();
    } catch (error) {
      console.error(`Error ${status} event:`, error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
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
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Start Date</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">End Date</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Location</th>
              
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 border-b text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">No pending events</td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{event.name}</td>
                  <td className="px-4 py-3 border-b max-w-xs whitespace-pre-wrap">{event.description}</td>
                  <td className="px-4 py-3 border-b">{new Date(event.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b">{new Date(event.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b">{event.location}</td>
          
                  <td className="px-4 py-3 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      event.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                        onClick={() => updateEventStatus(event._id, "approve", event.ngoEmail)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                        onClick={() => updateEventStatus(event._id, "reject", event.ngoEmail)}
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