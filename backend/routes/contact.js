const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// @route   POST api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('subject', 'Subject is required').not().isEmpty(),
    body('message', 'Message is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        subject,
        message
      });

      await newContact.save();
      res.json({ message: 'Message sent successfully!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/contact
// @desc    Get all contact messages
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/contact/:id
// @desc    Delete a contact message
// @access  Private (Admin)
// @route   DELETE api/contact/:id
// @desc    Delete a contact message
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id); // Updated to findByIdAndDelete
  
      if (!contact) {
        return res.status(404).json({ msg: 'Contact message not found' });
      }
  
      res.json({ msg: 'Contact message removed successfully' });
    } catch (err) {
      console.error('Delete error:', err.message);
      
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Contact message not found' });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;