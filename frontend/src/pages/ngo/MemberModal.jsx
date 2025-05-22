import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

const MemberModal = ({ isOpen, onClose, onSubmit, team }) => {
  const [formData, setFormData] = useState({
    userId: '',
    role: 'member'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold">Add Member to {team.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseLine size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="userId">
              Select Volunteer *
            </label>
            <select
              id="userId"
              name="userId"
              required
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select a volunteer</option>
              {/* You would typically fetch volunteers from API */}
              <option value="user1">John Doe (john@example.com)</option>
              <option value="user2">Jane Smith (jane@example.com)</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
              Role *
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="member">Member</option>
              <option value="leader">Team Leader</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-md hover:opacity-90"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
