'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { validateEmail, validatePassword, getPasswordStrength } from '@/utils/validation';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/auth/api';
import { authStorage } from '@/lib/auth/storage';
import { debugLog } from '@/utils/debug';
import { showToast } from '@/utils/toast';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/lib/auth/routes';

export function LoginForm() {
    console.log('LoginForm - Attempting to render');
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        server: ''
    });

    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'moderate' | 'strong'>('weak');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Real-time password strength check
    useEffect(() => {
        if (formData.password) {
            setPasswordStrength(getPasswordStrength(formData.password));
        }
    }, [formData.password]);

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'strong': return 'bg-green-500';
            case 'moderate': return 'bg-yellow-500';
            case 'weak': return 'bg-red-500';
            default: return 'bg-gray-200';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear errors when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Real-time validation
        if (name === 'email') {
            const validation = validateEmail(value);
            if (!validation.isValid) {
                setErrors(prev => ({ ...prev, email: validation.errors[0] }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({ email: '', password: '', server: '' });

        try {
            const emailValidation = validateEmail(formData.email);
            const passwordValidation = validatePassword(formData.password);
            
            if (!emailValidation.isValid) {
                setErrors(prev => ({ ...prev, email: emailValidation.errors[0] }));
                return;
            }
            if (!passwordValidation.isValid) {
                setErrors(prev => ({ ...prev, password: passwordValidation.errors[0] }));
                return;
            }

            debugLog('auth', 'Submitting login form', { email: formData.email });
            const loadingToastId = toast.loading('Signing in...').toString();
            
            const response = await authApi.login(formData.email, formData.password);
            
            if (response.success && response.token) {
                try {
                    authStorage.setToken(response.token);
                } catch (error) {
                    debugLog('auth', 'Storage error', { error });
                    toast.error('Storage error', {
                        description: 'Unable to store login data. Please check your privacy settings.'
                    });
                    return;
                }
                debugLog('auth', 'Login successful, redirecting...');
                toast.dismiss(loadingToastId);
                toast.success('Successfully signed in!');
                router.push('/dashboard');
            }
            
        } catch (error) {
            debugLog('auth', 'Login failed', { error });
            let errorMessage = 'Login failed';
            
            if (error instanceof Error) {
                if (error.message.includes('network') || error.message.includes('Network')) {
                    errorMessage = 'Network error. Please check your connection.';
                } else if (error.message.includes('Invalid')) {
                    errorMessage = 'Invalid email or password';
                } else {
                    errorMessage = error.message;
                }
            }
            
            toast.error(errorMessage, {
                description: 'Please try again or contact support if the problem persists.'
            });
            
            setErrors(prev => ({
                ...prev,
                server: errorMessage
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <Toaster richColors />
            <h1 className="text-left text-2xl font-bold">Welcome Back</h1>
            <p className="text-left text-gray-600 mb-6">Sign in to your account</p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
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

                <div className="remember-me">
                    <label className="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            name="remember"
                            checked={formData.remember}
                            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                        />
                        <span>Remember me</span>
                    </label>
                </div>

                {errors.server && (
                    <div className="server-error">
                        <p className="error-message">{errors.server}</p>
                    </div>
                )}

                <button type="submit" className="login-button" disabled={isLoading}>
                    <span className="button-text">{isLoading ? 'Signing in...' : 'Sign in'}</span>
                    <div className="spinner" style={{ display: isLoading ? 'block' : 'none' }}></div>
                </button>

                <div className="social-login">
                    <div className="divider">Or continue with</div>
                    <div className="social-buttons">
                        <button type="button" className="social-button google">
                            <svg className="google-icon" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.55 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button type="button" className="social-button apple">
                            <i className="fab fa-apple"></i>
                            Apple
                        </button>
                    </div>
                </div>
            </form>

            <p className="signup-text">
                Don't have an account?{' '}
                <Link href="/auth/register" className="signup-link">
                    Sign up
                </Link>
            </p>
        </div>
    );
}



