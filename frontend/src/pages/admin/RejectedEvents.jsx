import { useState, useEffect } from "react";

const RejectedEvents = () => {
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/events/rejected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "rejected" }),
    })
      .then((res) => res.json())
      .then((data) => setRejectedEvents(data))
      .catch((error) =>
        console.error("Error fetching rejected events:", error)
      );
  }, []);
  
  const unrejectEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/unreject/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to unreject the event");
      }
      // After successful update, refetch rejected events
      const updatedEvents = rejectedEvents.filter(
        (event) => event._id !== eventId
      );
      setRejectedEvents(updatedEvents);
    } catch (error) {
      console.error("Error unrejecting event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/delete/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }
      // After successful deletion, remove the event from the state
      const updatedEvents = rejectedEvents.filter(
        (event) => event._id !== eventId
      );
      setRejectedEvents(updatedEvents);
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Rejected Events</h2>

      {rejectedEvents.length === 0 ? (
        <p className="text-lg text-gray-500">No rejected events available.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 border-b font-medium">Event Name</th>
                <th className="px-4 py-3 border-b font-medium">Description</th>
                <th className="px-4 py-3 border-b font-medium">Organization</th>
                <th className="px-4 py-3 border-b font-medium">Status</th>
                <th className="px-4 py-3 border-b font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rejectedEvents.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{event.name}</td>
                  <td className="px-4 py-3 border-b">{event.description}</td>
                  <td className="px-4 py-3 border-b">{event.organization}</td>
                  <td className="px-4 py-3 border-b text-red-600">{event.status}</td>
                  <td className="px-4 py-3 border-b flex gap-2">
                    <button
                      onClick={() => unrejectEvent(event._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
                    >
                      Unreject
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setEventToDelete(event._id);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteEvent(eventToDelete);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedEvents;
