const { z } = require('zod');

// ===============================
// Auth
// ===============================

const LoginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const SignupSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
});

// ===============================
// Events
// ===============================

const CreateEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  event_type: z.string().min(1, { message: 'Event type is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  start_datetime: z.string().min(1, { message: 'Start date-time is required' }),
  end_datetime: z.string().min(1, { message: 'End date-time is required' }),
});

// ===============================
// HOD
// ===============================

const RejectEventSchema = z.object({
  reason: z.string().optional(),
});

// ===============================
// Todos
// ===============================

const CreateTodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

module.exports = {
  LoginSchema,
  SignupSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  CreateEventSchema,
  RejectEventSchema,
  CreateTodoSchema,
};
