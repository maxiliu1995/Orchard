'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPasswordMutation, useValidateResetTokenQuery } from '@/store/api/auth';
import { validatePassword, getPasswordStrength } from '@/utils/validation';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { data: tokenValidation, isLoading: validating } = useValidateResetTokenQuery(token);

  useEffect(() => {
    if (tokenValidation && !tokenValidation.valid) {
      showToast.error('Invalid or expired reset token');
      router.push('/auth/login');
    }
  }, [tokenValidation, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      showToast.error(validation.errors[0]);
      return;
    }

    try {
      debugLog('auth', 'Resetting password');
      await resetPassword({ token, password }).unwrap();
      showToast.success('Password reset successfully');
      router.push('/auth/login');
    } catch (error) {
      debugLog('auth', 'Password reset failed', { error });
      showToast.error('Failed to reset password');
    }
  };

  if (validating) {
    return <div>Validating reset token...</div>;
  }

  return (
    <div className="form-wrapper">
      <h1 className="text-2xl font-bold">Set New Password</h1>
      <p className="text-gray-600 mb-6">Choose a strong password</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          {password && (
            <div className="password-strength">
              Strength: {getPasswordStrength(password)}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
} 