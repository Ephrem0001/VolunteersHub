import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserPlus, FaUserMinus, FaUserLock, FaUserCheck, 
  FaEnvelope, FaSearch, FaTimes, FaSpinner 
} from 'react-icons/fa';
import { 
  getAdmins, registerAdmin, updateAdmin, 
  deleteAdmin, getProfile 
} from './adminService';
import { useAuth } from '../../context/AuthContext'; // Adjusted path

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const allPermissions = [
    'manage_ngos',
    'manage_volunteers',
    'approve_events',
    'view_analytics',
    'system_settings'
  ];

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: []
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const data = await getAdmins();
        setAdmins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || admin.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAddAdmin = async () => {
    try {
      const admin = await registerAdmin(newAdmin);
      setAdmins([...admins, admin]);
      setIsAdding(false);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAdminStatus = async (id, status) => {
    try {
      const updatedAdmin = await updateAdmin(id, { status });
      setAdmins(admins.map(admin => 
        admin._id === id ? updatedAdmin : admin
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const sendMessage = async () => {
    try {
      // Implement actual messaging functionality
      alert(`Message sent to ${selectedAdmin.name}: ${message}`);
      setMessage('');
      setSelectedAdmin(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search admins..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Add Admin
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['all', 'active', 'inactive', 'blocked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} ({tab === 'all' ? admins.length : admins.filter(a => a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add New Admin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Admin name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                  <div className="space-y-2">
                    {allPermissions.map(permission => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({...newAdmin, permissions: [...newAdmin.permissions, permission]});
                            } else {
                              setNewAdmin({...newAdmin, permissions: newAdmin.permissions.filter(p => p !== permission)});
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{permission.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {admin.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      admin.role === 'superadmin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : admin.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : admin.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {admin.status === 'active' ? (
                        <button
                          onClick={() => toggleAdminStatus(admin.id, 'inactive')}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Deactivate"
                        >
                          <FaUserLock />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleAdminStatus(admin.id, 'active')}
                          className="text-green-600 hover:text-green-800"
                          title="Activate"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                      {admin.status !== 'blocked' ? (
                        <button
                          onClick={() => toggleAdminStatus(admin.id, 'blocked')}
                          className="text-red-600 hover:text-red-800"
                          title="Block"
                        >
                          <FaUserMinus />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleAdminStatus(admin.id, 'active')}
                          className="text-blue-600 hover:text-blue-800"
                          title="Unblock"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Send Message"
                      >
                        <FaEnvelope />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAdmin(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2">
                Message to {selectedAdmin.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{selectedAdmin.email}</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                rows="5"
                placeholder="Type your message here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
