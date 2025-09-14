import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
});

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

// Password validation schema
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(100, 'Password is too long');

// Strong password validation (for future use)
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
  );

// Validation helpers
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors[0]?.message || 'Invalid email'
    };
  }
};

export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors[0]?.message || 'Invalid password'
    };
  }
};

export const validateLoginForm = (data) => {
  try {
    const validatedData = loginSchema.parse(data);
    return {
      isValid: true,
      data: validatedData,
      errors: null
    };
  } catch (error) {
    const fieldErrors = {};
    error.errors.forEach((err) => {
      fieldErrors[err.path[0]] = err.message;
    });

    return {
      isValid: false,
      data: null,
      errors: fieldErrors
    };
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
};

// Check password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'empty', score: 0, message: 'Enter a password' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[@$!%*?&]/.test(password)
  };

  Object.values(checks).forEach(check => {
    if (check) score++;
  });

  if (score < 2) {
    return { strength: 'weak', score, message: 'Very weak password' };
  } else if (score < 3) {
    return { strength: 'fair', score, message: 'Weak password' };
  } else if (score < 4) {
    return { strength: 'good', score, message: 'Good password' };
  } else if (score < 5) {
    return { strength: 'strong', score, message: 'Strong password' };
  } else {
    return { strength: 'very-strong', score, message: 'Very strong password' };
  }
};

export default {
  loginSchema,
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
  validateEmail,
  validatePassword,
  validateLoginForm,
  sanitizeInput,
  getPasswordStrength
};