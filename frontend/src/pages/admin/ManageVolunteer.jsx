import { useState, useEffect } from "react";

const ManageVolunteer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://volunteershub-6.onrender.com/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch volunteers");
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://volunteershub-6.onrender.com/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete volunteer");
      }

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle status toggle (block/unblock)
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      
      const response = await fetch(`https://volunteershub-6.onrender.com/api/volunteers/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setUsers(users.map(user => 
        user._id === id ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Volunteers</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading volunteers...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No volunteers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md mr-3 hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`${
                        user.status === 'blocked' ? "bg-green-500" : "bg-yellow-500"
                      } text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-all`}
                    >
                      {user.status === 'blocked' ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageVolunteer;
