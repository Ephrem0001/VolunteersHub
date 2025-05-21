const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const User = require('../models/User'); // Assuming you have a User model

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Schedule daily check at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    // Calculate target dates (today + 2 days and today + 5 days)
    const twoDaysLater = new Date(todayStart);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    
    const fiveDaysLater = new Date(todayStart);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    // Find events starting in exactly 2 or 5 days from today
    const upcomingEvents = await Event.find({
      startDate: {
        $gte: twoDaysLater,
        $lte: new Date(twoDaysLater.getTime() + 86400000 - 1) // Entire day range
      }
    }).concat(await Event.find({
      startDate: {
        $gte: fiveDaysLater,
        $lte: new Date(fiveDaysLater.getTime() + 86400000 - 1) // Entire day range
      }
    }));

    for (const event of upcomingEvents) {
      const daysUntilEvent = Math.ceil((event.startDate - now) / (1000 * 60 * 60 * 24));
      
      // Get all registered volunteers who want notifications
      const volunteers = await User.find({
        _id: { $in: event.volunteers },
        notificationPreferences: { $ne: false } // Only those who haven't opted out
      });

      for (const volunteer of volunteers) {
        await sendReminderEmail(volunteer, event, daysUntilEvent);
      }
    }
    
    console.log(`Sent reminders for ${upcomingEvents.length} events`);
  } catch (error) {
    console.error('Error in reminder service:', error);
  }
});

async function sendReminderEmail(user, event, daysRemaining) {
  try {
    const mailOptions = {
      from: `"Event Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Reminder: ${event.title} starts in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Event Reminder</h1>
          <p>Hello ${user.name},</p>
          <p>This is a reminder that the event <strong>${event.title}</strong> you registered for will start in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h2 style="color: #4a5568; margin-top: 0;">Event Details</h2>
            <p><strong>Date:</strong> ${event.startDate.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.startDate.toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
          </div>
          
          <p>We're looking forward to seeing you there!</p>
          <p style="color: #718096;">Best regards,<br>The Event Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Sent reminder to ${user.email} for event ${event.title}`);
  } catch (error) {
    console.error(`Failed to send reminder to ${user.email}:`, error);
  }
}

module.exports = { startReminderService: () => console.log('Event reminder service started') };