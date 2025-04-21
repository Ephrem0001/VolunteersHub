require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendVerificationEmail = async (email, token, name, userType) => {
  // Use FRONTEND_URL from environment variables with fallback
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify-email?token=${token}&email=${email}`;
  
  const mailOptions = {
    from: `"VolunteersHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Please click the button below to verify your ${userType} account:</p>
        <a href="${verificationLink}" 
           style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #6b7280;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { sendVerificationEmail };