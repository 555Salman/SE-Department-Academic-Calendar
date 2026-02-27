const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
const zodValidate = require('../middlewares/zodValidate');
const { LoginSchema, SignupSchema, ForgotPasswordSchema, ResetPasswordSchema } = require('../utils/zodSchemas');

// ===============================
// 🔐 Authentication Routes
// ===============================

// ===============================
// 🔹 Signup
// ===============================
router.post(
  '/signup',
  authLimiter,
  zodValidate(SignupSchema),
  [
    body('first_name')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),

    body('last_name')
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),

    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validate,
  authController.signup
);

// ===============================
// 🔹 Login
// ===============================
router.post(
  '/login',
  authLimiter,
  zodValidate(LoginSchema),
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  validate,
  authController.login
);

// ===============================
// 🔹 Forgot Password
// ===============================
router.post(
  '/forgot-password',
  authLimiter,
  zodValidate(ForgotPasswordSchema),
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
  ],
  validate,
  authController.forgotPassword
);

// ===============================
// 🔹 Reset Password
// ===============================
router.post(
  '/reset-password',
  authLimiter,
  zodValidate(ResetPasswordSchema),
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),

    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  validate,
  authController.resetPassword
);

module.exports = router;
