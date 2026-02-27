const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const eventController = require('../controllers/eventController');

const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

// ==============================
// 🔹 Create Event
// ==============================
// ADMIN → Directly approved
// LECTURER → Goes to HOD approval (handled in controller)
router.post(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER'),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),

    body('event_type')
      .notEmpty()
      .withMessage('Event type is required'),

    body('location')
      .trim()
      .notEmpty()
      .withMessage('Location is required'),

    body('start_datetime')
      .isISO8601()
      .withMessage('Valid start date-time required'),

    body('end_datetime')
      .isISO8601()
      .withMessage('Valid end date-time required')
  ],
  validate,
  eventController.createEvent
);

// ==============================
// 🔹 Get All Events
// ==============================
// All authenticated users can view events
router.get(
  '/',
  verifyToken,
  eventController.getEvents
);

// ==============================
// 🔹 Get Single Event
// ==============================
router.get(
  '/:id',
  verifyToken,
  eventController.getEventById
);

// ==============================
// 🔹 Update Event
// ==============================
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER'),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required'),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),

    body('event_type')
      .notEmpty()
      .withMessage('Event type is required'),

    body('location')
      .trim()
      .notEmpty()
      .withMessage('Location is required'),

    body('start_datetime')
      .isISO8601()
      .withMessage('Valid start date-time required'),

    body('end_datetime')
      .isISO8601()
      .withMessage('Valid end date-time required')
  ],
  validate,
  eventController.updateEvent
);

// ==============================
// 🔹 Delete Event
// ==============================
// Only ADMIN and LECTURER can delete
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER'),
  eventController.deleteEvent
);

module.exports = router;
