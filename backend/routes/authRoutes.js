// In your backend routes (e.g., routes/auth.js)
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'No account with that email exists'
      });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();

    // 3. In production: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // await sendResetEmail(user.email, resetUrl);
    
    // For development - log the token
    console.log('Reset Token:', resetToken);
    
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      token: resetToken // Remove in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
});


  // Validate reset token endpoint
  router.get('/validate-reset-token/:token', async (req, res) => {
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      res.status(200).json({ valid: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Reset password endpoint
  router.post('/reset-password/:token', async (req, res) => {
    try {
      const { password } = req.body;
      
      // 1. Find user by token
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      // 2. Update password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      // 3. Send confirmation email
      await sendPasswordChangedEmail(user.email);
      
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  module.exports = router;