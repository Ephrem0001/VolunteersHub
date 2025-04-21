import { useState, useEffect } from 'react';
import { RiTeamFill, RiAddLine, RiUserAddLine, RiPencilLine, RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import TeamModal from '../ngo/TeamModal';
import MemberModal from '../ngo/MemberModal';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teams/ngo`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch teams');
        
        const data = await response.json();
        // Ensure data is always an array
        setTeams(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message);
        setTeams([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
  
    fetchTeams();
  }, []);

  const handleCreateTeam = async (teamData) => {
    try {
      // Validate required fields
      if (!teamData.name || !teamData.shelterId) {
        throw new Error('Team name and shelter are required');
      }
  
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: teamData.name,
          description: teamData.description,
          shelterId: teamData.shelterId // Ensure this is a valid ObjectId string
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create team');
      }
  
      const newTeam = await response.json();
      setTeams(prevTeams => [...prevTeams, newTeam]);
      toast.success('Team created successfully!');
      setShowTeamModal(false);
    } catch (error) {
      toast.error(error.message);
      console.error('Create team error:', error);
    }
  };
  const handleAddMember = async (teamId, memberData) => {
    try {
  // For adding members
const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(memberData)
  });

      if (!response.ok) throw new Error('Failed to add member');

      const updatedTeam = await response.json();
      setTeams(teams.map(t => t._id === updatedTeam._id ? updatedTeam : t));
      toast.success('Member added successfully!');
      setShowMemberModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <RiTeamFill className="text-yellow-500 mr-3" />
            Volunteer Teams
          </h1>
          <p className="text-gray-600 mt-2">Organize and manage your volunteer teams</p>
        </div>
        <button
          onClick={() => setShowTeamModal(true)}
          className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition-opacity"
        >
          <RiAddLine className="mr-2" />
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-4 text-white">
              <h3 className="text-xl font-semibold">{team.name}</h3>
              <p className="text-yellow-100 text-sm mt-1">{team.shelter?.name}</p>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 mb-4">{team.description || 'No description provided'}</p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Team Members ({team.members.length})</h4>
                <div className="space-y-2">
                  {team.members.slice(0, 3).map(member => (
                    <div key={member.user._id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {member.user.avatar ? (
                          <img src={member.user.avatar} alt={member.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-600 text-sm">
                            {member.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{member.user.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <p className="text-sm text-gray-500">+{team.members.length - 3} more members</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowMemberModal(true);
                  }}
                  className="text-yellow-600 hover:text-yellow-700 flex items-center text-sm"
                >
                  <RiUserAddLine className="mr-1" />
                  Add Member
                </button>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <RiPencilLine />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <RiTeamFill className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No teams created yet</h3>
          <p className="text-gray-500 mt-2 mb-6">Get started by creating your first volunteer team</p>
          <button
            onClick={() => setShowTeamModal(true)}
            className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-2 rounded-lg flex items-center mx-auto hover:opacity-90 transition-opacity"
          >
            <RiAddLine className="mr-2" />
            Create Team
          </button>
        </div>
      )}

      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onSubmit={handleCreateTeam}
      />

      <MemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSubmit={(memberData) => handleAddMember(selectedTeam._id, memberData)}
        team={selectedTeam}
      />
    </div>
  );
};

export default Teams;