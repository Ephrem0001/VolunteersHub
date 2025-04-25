import { useState, useEffect } from "react";
import { FaTrash, FaBan, FaCheckCircle } from "react-icons/fa"; // Adding icons for actions

const ManageNGO = () => {
  const [ngoUsers, setNGOUsers] = useState([]);

  useEffect(() => {
    // Fetch NGO users from the API
    fetch("http://localhost:5000/api/ngo/ngo-users")
      .then((res) => res.json())
      .then((data) => setNGOUsers(data))
      .catch((error) => console.error("Error fetching NGO users:", error));
  }, []);

  // Function to delete NGO user
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this NGO?")) return;

    fetch(`http://localhost:5000/api/ngo/ngo-users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setNGOUsers(ngoUsers.filter((ngo) => ngo._id !== id)))
      .catch((error) => console.error("Error deleting NGO:", error));
  };

  // Function to block/unblock NGO user
  const handleBlock = (id, status) => {
    fetch(`http://localhost:5000/api/ngo/ngo-users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updatedUser) =>
        setNGOUsers(
          ngoUsers.map((ngo) => (ngo._id === id ? { ...ngo, status: updatedUser.status } : ngo))
        )
      )
      .catch((error) => console.error("Error updating NGO status:", error));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage NGO Users</h2>
      {ngoUsers.length === 0 ? (
        <p className="text-gray-600">No NGOs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Organization</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngoUsers.map((ngo) => (
                <tr key={ngo._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{ngo.name}</td>
                  <td className="px-4 py-2">{ngo.email}</td>
                  <td className="px-4 py-2">{ngo.organization}</td>
                  <td className="px-4 py-2">{ngo.role}</td>
                  <td className="px-4 py-2 flex justify-start space-x-3">
                    <button
                      onClick={() => handleDelete(ngo._id)}
                      className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleBlock(ngo._id, ngo.status === "blocked" ? "active" : "blocked")}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        ngo.status === "blocked" ? "bg-green-600" : "bg-yellow-600"
                      } text-white hover:bg-opacity-90 transition-all`}
                    >
                      {ngo.status === "blocked" ? (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <FaBan className="mr-2" />
                          Block
                        </>
                      )}
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

export default ManageNGO;
