import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaUsers, FaTrash, FaEdit, FaSearch,
  FaUserPlus, FaUserTimes, FaArrowLeft, FaBell,
  FaUserCircle, FaChevronDown, FaChevronUp,
  FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle
} from "react-icons/fa";
import { RiTeamFill, RiEventFill } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: ""
  });
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [showEventParticipants, setShowEventParticipants] = useState(false);

  // Fetch user data, teams, and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch user profile
        const userResponse = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data.user);
        
        // Fetch teams
        const teamsResponse = await axios.get("/api/teams", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeams(teamsResponse.data);
        setFilteredTeams(teamsResponse.data);
        
        // Fetch events created by this NGO
        const eventsResponse = await axios.get("/api/events/created-by-ngo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(eventsResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter teams based on search term
  useEffect(() => {
    const filtered = teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  // Fetch available members for a team
  const fetchAvailableMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users/organization-members", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out members already in the team
      const available = response.data.filter(
        member => !selectedTeam.members.some(m => m._id === member._id)
      );
      
      setAvailableMembers(available);
    } catch (error) {
      toast.error("Failed to fetch available members");
    }
  };

  // Fetch participants for an event
  const fetchEventParticipants = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/events/${eventId}/participants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventParticipants(response.data);
      setShowEventParticipants(true);
    } catch (error) {
      toast.error("Failed to fetch event participants");
    }
  };

  // Handle team selection
  const handleTeamSelect = async (team) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/teams/${team._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTeam(response.data);
      setSelectedEvent(null);
      setShowEventParticipants(false);
    } catch (error) {
      toast.error("Failed to fetch team details");
    }
  };

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSelectedTeam(null);
    fetchEventParticipants(event._id);
  };

  // Create a new team
  const handleCreateTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/teams", newTeam, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTeams([...teams, response.data]);
      setNewTeam({ name: "", description: "" });
      setIsCreatingTeam(false);
      toast.success("Team created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  };

  // Update a team
  const handleUpdateTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/teams/${selectedTeam._id}`,
        { name: selectedTeam.name, description: selectedTeam.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTeams(teams.map(t => t._id === response.data._id ? response.data : t));
      toast.success("Team updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update team");
    }
  };

  // Delete a team
  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTeams(teams.filter(t => t._id !== teamId));
        if (selectedTeam && selectedTeam._id === teamId) {
          setSelectedTeam(null);
        }
        toast.success("Team deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete team");
      }
    }
  };

  // Add member to team
  const handleAddMember = async () => {
    if (!selectedMember) {
      toast.error("Please select a member to add");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/teams/${selectedTeam._id}/members`,
        { memberId: selectedMember },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedTeam(response.data);
      setSelectedMember("");
      setIsAddingMember(false);
      toast.success("Member added to team");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  // Remove member from team
  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member from the team?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `/api/teams/${selectedTeam._id}/members/${memberId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setSelectedTeam(response.data);
        toast.success("Member removed from team");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove member");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gray-800/80 backdrop-blur-md text-white p-5 flex justify-between items-center shadow-lg rounded-b-xl border-b border-teal-400/20"
      >
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/ngo/dashboard")}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <RiTeamFill className="text-3xl text-teal-400" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
            Team Management
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={() => setShowNotification(!showNotification)}
          >
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </motion.button>
          
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
              <span className="hidden md:inline">{user?.name || "User"}</span>
              {showProfileMenu ? <FaChevronUp /> : <FaChevronDown />}
            </motion.button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                      onClick={() => navigate("/profile")}
                    >
                      Your Profile
                    </button>
                  
                    <div className="border-t border-gray-600"></div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 w-80 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowNotification(false)}
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {[
                { id: 1, title: "New team member", message: "John joined your 'Clean Water' team", time: "2h ago", read: false },
                { id: 2, title: "Team update", message: "Your 'Education' team has reached its goal", time: "1d ago", read: true },
                { id: 3, title: "Volunteer request", message: "5 new volunteers want to join your team", time: "3d ago", read: true }
              ].map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer ${!notification.read ? 'bg-blue-900/20' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-teal-400">{notification.title}</h4>
                      <p className="text-sm text-gray-300">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer border-t border-gray-700">
              View All Notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-grow flex flex-col items-center p-4 md:p-8 space-y-8"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl w-full"
        >
          <div className="relative inline-block">
            <motion.h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-600 drop-shadow-lg mb-4">
              Manage Your Teams
            </motion.h2>
            <motion.span 
              className="absolute -top-6 -right-8 text-4xl" 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👥
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-300 mt-4 leading-relaxed max-w-3xl mx-auto"
          >
            Organize your volunteers into teams to better manage events and track participation.
          </motion.p>

          {/* Search and Create Team */}
          <div className="mt-8 w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search teams by name..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => {
                setSelectedTeam(null);
                setIsCreatingTeam(true);
              }}
              className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 px-6 py-3 rounded-xl"
            >
              <FaPlus className="mr-2" /> Create New Team
            </Button>
          </div>
        </motion.div>

        {/* Teams Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <RiTeamFill className="text-teal-400" /> Your Teams ({teams.length})
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  {searchTerm ? "No teams match your search" : "No teams found"}
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredTeams.map((team) => (
                    <motion.div
                      key={team._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTeam?._id === team._id 
                          ? 'bg-teal-500/20 border border-teal-400/30' 
                          : 'bg-gray-700/50 hover:bg-gray-700/70'
                      }`}
                      onClick={() => handleTeamSelect(team)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-gray-300 truncate">{team.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-600/50 px-2 py-1 rounded-full flex items-center gap-1">
                            <FaUsers className="text-xs" /> {team.members.length}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTeam(team._id);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Team Details / Create Team */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              {isCreatingTeam ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                        placeholder="Enter team name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                        placeholder="Enter team description"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        onClick={() => setIsCreatingTeam(false)}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateTeam}
                        disabled={!newTeam.name}
                        className={`px-4 py-2 rounded-lg ${
                          !newTeam.name 
                            ? 'bg-teal-800 cursor-not-allowed' 
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        Create Team
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : selectedTeam ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Team Details</h2>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          setIsAddingMember(true);
                          fetchAvailableMembers();
                        }}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded-lg"
                      >
                        <FaUserPlus /> Add Member
                      </Button>
                      <Button 
                        onClick={handleUpdateTeam}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-3 py-1.5 rounded-lg"
                      >
                        <FaEdit /> Save Changes
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                        value={selectedTeam.name}
                        onChange={(e) => setSelectedTeam({ ...selectedTeam, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                        value={selectedTeam.description}
                        onChange={(e) => setSelectedTeam({ ...selectedTeam, description: e.target.value })}
                        rows="3"
                      />
                    </div>

                    {/* Members Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <FaUsers /> Team Members ({selectedTeam.members.length})
                      </h3>
                      
                      {isAddingMember && (
                        <motion.div
                          className="mb-4 p-4 bg-gray-700/30 rounded-lg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex items-center gap-3">
                            <select
                              className="flex-grow px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                              value={selectedMember}
                              onChange={(e) => setSelectedMember(e.target.value)}
                            >
                              <option value="">Select a member to add</option>
                              {availableMembers.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name} ({member.email})
                                </option>
                              ))}
                            </select>
                            <Button 
                              onClick={handleAddMember}
                              disabled={!selectedMember}
                              className={`px-4 py-2 ${
                                !selectedMember 
                                  ? 'bg-teal-800 cursor-not-allowed' 
                                  : 'bg-teal-600 hover:bg-teal-500'
                              }`}
                            >
                              Add
                            </Button>
                            <Button 
                              onClick={() => setIsAddingMember(false)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-500"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {selectedTeam.members.length === 0 ? (
                        <div className="text-center py-6 text-gray-400">
                          No members in this team yet
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedTeam.members.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-600/30 flex items-center justify-center">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-medium">{member.name}</h4>
                                  <p className="text-sm text-gray-400">{member.email}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                title="Remove member"
                              >
                                <FaUserTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <RiTeamFill className="text-5xl mb-4" />
                  <p className="text-lg">Select a team to view details</p>
                  <p className="text-sm mt-2">or create a new team</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-md text-gray-300 text-center py-8 mt-auto border-t border-gray-700/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-teal-400 mb-2">VolunteersHub</h4>
              <p className="text-sm max-w-md">Connecting compassionate individuals with meaningful opportunities to create positive change in communities worldwide.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left">
              <div>
                <h5 className="font-semibold text-white mb-3">Explore</h5>
                <ul className="space-y-2">
                  {['Events', 'Organizations', 'Success Stories', 'Blog'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-white mb-3">About</h5>
                <ul className="space-y-2">
                  {['Our Mission', 'Team', 'Partners', 'Careers'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-white mb-3">Support</h5>
                <ul className="space-y-2">
                  {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} VolunteersHub. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-xs hover:text-teal-400 transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Teams;