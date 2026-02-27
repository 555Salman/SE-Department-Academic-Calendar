const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../services/emailService');


// =======================
// 🔐 SIGNUP (Activation)
// =======================
exports.signup = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(403).json({
        message: 'You are not authorized. Please contact admin.'
      });
    }

    const user = results[0];

    if (user.password !== null) {
      return res.status(400).json({
        message: 'Account already activated. Please login.'
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        `UPDATE users 
         SET first_name = ?, last_name = ?, password = ?, is_active = 1 
         WHERE email = ?`,
        [first_name, last_name, hashedPassword, email],
        (updateErr) => {
          if (updateErr)
            return res.status(500).json({ message: 'Error updating user' });

          return res.status(200).json({
            message: 'Account activated successfully'
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Password hashing failed' });
    }
  });
};



// =======================
// 🔐 LOGIN
// =======================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = results[0];

    if (!user.is_active) {
      return res.status(403).json({
        message: 'Account not activated. Please signup first.'
      });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          department: user.department
        }
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Authentication failed'
      });
    }
  });
};



// =======================
// 🔐 FORGOT PASSWORD (EMAIL ENABLED)
// =======================
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    // Do not reveal whether user exists
    if (results.length === 0) {
      return res.status(200).json({
        message: 'If this email exists, a password reset link has been sent.'
      });
    }

    const user = results[0];


    const token = crypto.randomBytes(32).toString('hex');


    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expiry) VALUES (?, ?, ?)',
      [user.id, token, expiry],
      async (insertErr) => {
        if (insertErr)
          return res.status(500).json({ message: 'Error generating reset token' });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        try {
          await sendResetEmail(email, resetLink);

          return res.status(200).json({
            message: 'If this email exists, a password reset link has been sent.'
          });

        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          return res.status(500).json({
            message: 'Failed to send reset email'
          });
        }
      }
    );
  });
};



// =======================
// 🔐 RESET PASSWORD
// =======================
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: 'Token and new password are required'
    });
  }

  db.query(
    'SELECT * FROM password_reset_tokens WHERE token = ?',
    [token],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const resetToken = results[0];

      if (new Date(resetToken.expiry) < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, resetToken.user_id],
          (updateErr) => {
            if (updateErr)
              return res.status(500).json({ message: 'Error updating password' });

            // Delete used token
            db.query(
              'DELETE FROM password_reset_tokens WHERE id = ?',
              [resetToken.id]
            );

            return res.status(200).json({
              message: 'Password successfully reset'
            });
          }
        );

      } catch (error) {
        return res.status(500).json({
          message: 'Password reset failed'
        });
      }
    }
  );
};
