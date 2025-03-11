export const authValidation = {
    validateEmail(email: string): ValidationResult {
        const errors: string[] = [];
        
        if (!email) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push('Please enter a valid email address');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validatePassword(password: string): ValidationResult {
        const errors: string[] = [];

        if (!password) {
            errors.push('Password is required');
        } else {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!/[0-9]/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (!/[!@#$%^&*]/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },
