const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const Applier = require('../models/Applier');
const moment = require('moment-timezone'); // Added for timezone support

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Track sent notifications to prevent duplicates
const sentNotifications = new Set();

// Scheduled job to check events and send notifications
cron.schedule('0 9 * * *', async () => { // Runs daily at 9 AM
  try {
    const now = new Date();
    console.log(`Running notification check at ${now.toISOString()}`);

    // Find events starting in the future
    const events = await Event.find({
      startDate: { $gt: now }
    });

    for (const event of events) {
      // Calculate days remaining with timezone consideration
      const daysRemaining = Math.ceil(
        moment(event.startDate).diff(moment(), 'days', true)
      );

      // Check for 5 or 2 days remaining
      if ([5, 2].includes(daysRemaining)) {
        const notificationKey = `${event._id}-${daysRemaining}`;
        
        // Skip if we already sent this notification
        if (sentNotifications.has(notificationKey)) {
          console.log(`Skipping already sent notification for ${notificationKey}`);
          continue;
        }

        // Get appliers who want notifications
        const appliers = await Applier.find({ 
          eventId: event._id,
          receiveNotifications: true // Only those who opted in
        }).populate('userId', 'email name');

        if (appliers.length === 0) {
          console.log(`No appliers to notify for event ${event.name}`);
          continue;
        }

        // Send notifications
        const sendPromises = appliers.map(applier => {
          if (applier.userId && applier.userId.email) {
            return sendReminderEmail(
              applier.userId.email,
              applier.userId.name,
              event,
              daysRemaining
            );
          }
          return Promise.resolve();
        });

        await Promise.all(sendPromises);
        
        // Mark as sent
        sentNotifications.add(notificationKey);
        console.log(`Sent ${daysRemaining}-day reminders for ${event.name}`);
      }
    }
  } catch (error) {
    console.error('Error in notification cron job:', error);
  }
});

// Enhanced email function with better formatting
async function sendReminderEmail(email, name, event, daysRemaining) {
  try {
    const formattedDate = moment(event.startDate)
      .tz('Africa/Addis_Ababa') // Adjust to your timezone
      .format('LLLL');

    const mailOptions = {
      from: `VolunteerHub <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `⏰ Reminder: ${event.name} starts in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>
          <p>This is a friendly reminder about the upcoming event:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #3498db;">${event.name}</h3>
            <p><strong>🗓 Date:</strong> ${formattedDate}</p>
            <p><strong>📍 Location:</strong> ${event.location}</p>
            <p>The event starts in <strong>${daysRemaining} day${daysRemaining > 1 ? 's' : ''}</strong>!</p>
          </div>

          <p>We're excited to have you participate in this event.</p>
          <p>If you can no longer attend, please update your registration.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Best regards,</p>
            <p><strong>The VolunteerHub Team</strong></p>
          </div>
        </div>
      `,
      // Optional text version for email clients that don't support HTML
      text: `
        Hello ${name},\n\n
        Reminder: ${event.name} starts in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.\n
        Date: ${formattedDate}\n
        Location: ${event.location}\n\n
        We're excited to have you participate!\n\n
        Best regards,\n
        The VolunteerHub Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw error;
  }
}

module.exports = { transporter };