import { useEffect, useState } from "react";

const MyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch announcements from the backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("https://eventmannagemnt-11.onrender.com/api/announcements");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Handle adding a new announcement
  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      alert("Please enter a valid announcement.");
      return;
    }

    try {
      const response = await fetch("https://eventmannagemnt-11.onrender.com/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newAnnouncement }),
      });

      if (!response.ok) {
        throw new Error("Failed to add announcement");
      }

      const addedAnnouncement = await response.json();
      setAnnouncements([addedAnnouncement, ...announcements]);
      setNewAnnouncement("");
      alert("Announcement added successfully!");
    } catch (error) {
      console.error("Error adding announcement:", error);
      alert("Failed to add announcement.");
    }
  };

  // Handle deleting an announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`https://eventmannagemnt-11.onrender.com/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
      alert("Announcement deleted successfully!");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Announcements</h2>

      {/* Add Announcement Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <textarea
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          placeholder="Share an important update with volunteers..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />
        <button
          onClick={handleAddAnnouncement}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105 duration-200"
        >
          Post Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 duration-300"
          >
            <p className="text-gray-800">{announcement.message}</p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDeleteAnnouncement(announcement._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors transform hover:scale-105 duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAnnouncements;