import { useEffect, useState } from "react";

const ManageRegistrations = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch registered NGOs & volunteers (Dummy data for now)
    setUsers([
      { id: 1, name: "John Doe", role: "Volunteer" },
      { id: 2, name: "Green Earth", role: "NGO" },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage NGO & Volunteer Registrations</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRegistrations;
