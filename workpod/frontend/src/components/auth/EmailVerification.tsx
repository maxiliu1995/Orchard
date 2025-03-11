'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyEmailMutation } from '@/store/api/auth';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

export function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        showToast.error('Invalid verification link');
        router.push('/auth/login');
        return;
      }

      try {
        debugLog('auth', 'Verifying email token');
        await verifyEmail(token).unwrap();
        setVerified(true);
        showToast.success('Email verified successfully');
      } catch (error) {
        debugLog('auth', 'Email verification failed', { error });
        showToast.error('Failed to verify email');
        router.push('/auth/login');
      }
    };

    verifyToken();
  }, [token, verifyEmail, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-500 text-6xl">✓</div>
        <h1 className="text-2xl font-bold">Email Verified!</h1>
        <p className="text-gray-600">Your email has been successfully verified.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Continue to Login
        </button>
      </div>
    );
  }

  return null;
} 