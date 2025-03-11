'use client';

import { useState } from 'react';
import { useRequestPasswordResetMutation } from '@/store/api/auth';
import { Button } from '@/components/ui/Button';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestReset(email).unwrap();
      setSubmitted(true);
    } catch (error) {
      // Handle error
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Check Your Email</h2>
        <p className="mt-2 text-gray-600">
          If an account exists for {email}, you will receive password reset instructions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Sending...' : 'Reset Password'}
      </Button>
    </form>
  );
} 