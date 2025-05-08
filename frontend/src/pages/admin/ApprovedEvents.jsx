import { useEffect, useState } from "react";

const ApprovedEvents = () => {
  const [events, setEvents] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events/approved");
      

      if (!response.ok) {
        throw new Error("Failed to fetch approved events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching approved events:", error);
    }
  };

  const disapproveEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/disapprove/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to disapprove the event");
      }

      // After successful disapproval, refetch approved events
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error disapproving event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      // After successful deletion, remove the event from the list
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Approved Events</h2>

      {events.length === 0 ? (
        <p className="text-lg text-gray-500">No approved events available.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 border-b font-medium">Event Name</th>
                <th className="px-4 py-3 border-b font-medium">Status</th>
                <th className="px-4 py-3 border-b font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{event.name}</td>
                  <td className="px-4 py-3 border-b text-green-600">{event.status}</td>
                  <td className="px-4 py-3 border-b flex gap-2">
                    <button
                      onClick={() => disapproveEvent(event._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                    >
                      Disapprove
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

export default ApprovedEvents;
