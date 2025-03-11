'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { validateEmail, validatePassword, getPasswordStrength } from '@/utils/validation';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/auth/api';
import { authStorage } from '@/lib/auth/storage';
import { debugLog } from '@/utils/debug';
import { toast } from '@/utils/toast';
import { Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/lib/auth/routes';
import { useRegisterMutation } from '@/store/api/auth';

export function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        server: ''
    });

    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'moderate' | 'strong'>('weak');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    useEffect(() => {
        if (formData.password) {
            setPasswordStrength(getPasswordStrength(formData.password));
        }
    }, [formData.password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'email') {
            const validation = validateEmail(value);
            if (!validation.isValid) {
                setErrors(prev => ({ ...prev, email: validation.errors[0] }));
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            server: ''
        });

        try {
            const formData = new FormData(e.currentTarget);
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                phone: formData.get('phone') as string || undefined
            };

            // Validate required fields
            if (!data.email || !data.password || !data.firstName || !data.lastName) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Log the request (without sensitive data)
            console.log('Attempting registration with:', {
                ...data,
                password: '[REDACTED]'
            });

            const loadingToastId = toast.loading('Creating your account...').toString();
            
            const response = await register(data).unwrap();
            console.log('Registration successful:', response);
            
            toast.dismiss(loadingToastId);
            toast.success('Account created successfully!');
            
            router.push('/auth/login');
        } catch (error: any) {
            console.error('Registration failed:', {
                error,
                status: error?.status,
                data: error?.data,
                message: error?.message
            });

            let errorMessage = 'Failed to create account';
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'strong': return 'bg-green-500';
            case 'moderate': return 'bg-yellow-500';
            case 'weak': return 'bg-red-500';
            default: return 'bg-gray-200';
        }
    };

    return (
        <div className="form-wrapper">
            <Toaster richColors />
            <h1 className="text-left text-2xl font-bold">Create an Account</h1>
            <p className="text-left text-gray-600 mb-6">Join WorkPod today</p>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'error' : ''}
                            required
                        />
                        <AnimatePresence>
                            {errors.firstName && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="error-message"
                                >
                                    {errors.firstName}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'error' : ''}
                            required
                        />
                        <AnimatePresence>
                            {errors.lastName && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="error-message"
                                >
                                    {errors.lastName}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <div className="input-wrapper">
                        <i className="fas fa-envelope input-icon"></i>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`${errors.email ? 'error' : ''} transition-all duration-200`}
                            autoComplete="email"
                            required
                        />
                        <AnimatePresence>
                            {!errors.email && formData.email && validateEmail(formData.email).isValid && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 text-green-500"
                                >
                                    <i className="fas fa-check-circle" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <AnimatePresence>
                        {errors.email && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="error-message"
                            >
                                {errors.email}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="form-group">
                    <div className="password-label-wrapper">
                        <label htmlFor="password">Password</label>
                        <Link href="/auth/forgot-password" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="input-wrapper">
                        <i className="fas fa-lock input-icon"></i>
                        <input 
                            type={showPassword ? "text" : "password"}
                            id="password" 
                            name="password" 
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            required
                        />
                        <button 
                            type="button" 
                            className="toggle-password" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex items-center space-x-2">
                                <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ 
                                            width: passwordStrength === 'weak' ? '33%' : 
                                                   passwordStrength === 'moderate' ? '66%' : '100%' 
                                        }}
                                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                    />
                                </div>
                                <span className="text-xs text-gray-500 capitalize">{passwordStrength}</span>
                            </div>
                        </div>
                    )}
                    <AnimatePresence>
                        {errors.password && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="error-message"
                            >
                                {errors.password}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                        <i className="fas fa-lock input-icon"></i>
                        <input 
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword" 
                            name="confirmPassword" 
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            required
                        />
                    </div>
                    <AnimatePresence>
                        {errors.confirmPassword && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="error-message"
                            >
                                {errors.confirmPassword}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <button type="submit" className="register-button" disabled={isLoading}>
                    <span className="button-text">
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </span>
                    <div className="spinner" style={{ display: isLoading ? 'block' : 'none' }}></div>
                </button>
            </form>

            <p className="login-text">
                Already have an account?{' '}
                <Link href="/auth/login" className="login-link">
                    Sign in
                </Link>
            </p>
        </div>
    );
}





