const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Team = require('../models/Team');

// Create a new team
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can create teams' });
    }

    const team = new Team({
      name: req.body.name,
      description: req.body.description,
      shelter: req.body.shelterId,
      ngo: req.user.id,
      members: [{
        user: req.user.id,
        role: 'leader'
      }]
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all teams for an NGO
router.get('/ngo', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const teams = await Team.find({ ngo: req.user.id })
      .populate('shelter', 'name location')
      .populate('members.user', 'name email avatar');
      
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to team
router.post('/:teamId/members', verifyToken, async (req, res) => {
  try {
    const team = await Team.findOne({
      _id: req.params.teamId,
      ngo: req.user.id
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found or unauthorized' });
    }

    team.members.push({
      user: req.body.userId,
      role: req.body.role || 'member'
    });

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;