export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  specialChars?: string;
}

const DEFAULT_PASSWORD_OPTIONS: PasswordValidationOptions = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*'
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      error: 'Email cannot be empty'
    };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  return { isValid: true };
};

export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = DEFAULT_PASSWORD_OPTIONS
): ValidationResult => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    specialChars = '!@#$%^&*'
  } = options;

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    };
  }

  if (requireSpecialChars && !new RegExp(`[${specialChars}]`).test(password)) {
    return {
      isValid: false,
      error: `Password must contain at least one special character (${specialChars})`
    };
  }

  return { isValid: true };
};

export const validateUUID = (uuid: string): ValidationResult => {
  if (!uuid || typeof uuid !== 'string') {
    return {
      isValid: false,
      error: 'UUID is required'
    };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    return {
      isValid: false,
      error: 'Invalid UUID format'
    };
  }

  return { isValid: true };
};

export const validateName = (name: string, field: string = 'Name'): ValidationResult => {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: `${field} is required`
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: `${field} cannot be empty`
    };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: `${field} must be at least 2 characters long`
    };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: `${field} can only contain letters, spaces, hyphens, and apostrophes`
    };
  }

  return { isValid: true };
};

export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  // E.164 format validation (e.g., +1234567890)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      error: 'Invalid phone number format. Must be in E.164 format (e.g., +1234567890)'
    };
  }

  return { isValid: true };
};


