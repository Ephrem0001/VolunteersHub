// services/notificationService.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const Volunteer = require('../models/Volunteer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Schedule daily check at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    const now = new Date();
    const fiveDaysFromNow = new Date(now);
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    // Find events starting in exactly 5 or 2 days
    const upcomingEvents = await Event.find({
      startDate: { 
        $in: [
          new Date(fiveDaysFromNow.setHours(0, 0, 0, 0)),
          new Date(twoDaysFromNow.setHours(0, 0, 0, 0))
        ]
      }
    });

    for (const event of upcomingEvents) {
      const daysUntilEvent = Math.ceil((event.startDate - now) / (1000 * 60 * 60 * 24));
      
      // Get all volunteers registered for this event
      const volunteers = await Volunteer.find({ 
        _id: { $in: event.volunteers } 
      });

      for (const volunteer of volunteers) {
        await sendReminderEmail(volunteer, event, daysUntilEvent);
      }
    }
  } catch (error) {
    console.error('Error in notification cron job:', error);
  }
});

async function sendReminderEmail(volunteer, event, daysRemaining) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: volunteer.email,
    subject: `Reminder: ${event.name} starts in ${daysRemaining} days`,
    html: `
      <h1>Event Reminder</h1>
      <p>Hello ${volunteer.name},</p>
      <p>This is a reminder that the event <strong>${event.name}</strong> you registered for will start in ${daysRemaining} days.</p>
      <p><strong>Event Details:</strong></p>
      <ul>
        <li>Date: ${event.startDate.toLocaleDateString()}</li>
        <li>Location: ${event.location}</li>
      </ul>
      <p>We're looking forward to seeing you there!</p>
      <p>Best regards,<br>The Event Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${volunteer.email} for event ${event.name}`);
  } catch (error) {
    console.error(`Failed to send email to ${volunteer.email}:`, error);
  }
}