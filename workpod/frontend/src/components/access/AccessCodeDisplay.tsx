import { useState, useEffect } from 'react';
import { useGetAccessCodeQuery, useRevokeAccessCodeMutation } from '@/store/api/access';
import { Button } from '@/components/ui/Button';

interface AccessCodeDisplayProps {
  bookingId: string;
  onExpired?: () => void;
}

export const AccessCodeDisplay = ({ bookingId, onExpired }: AccessCodeDisplayProps) => {
  const { data: accessCode, isLoading } = useGetAccessCodeQuery(bookingId);
  const [revokeCode] = useRevokeAccessCodeMutation();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!accessCode) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const validUntil = new Date(accessCode.validUntil);
      const diff = validUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        onExpired?.();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    return () => clearInterval(timer);
  }, [accessCode, onExpired]);

  if (isLoading) return <div>Loading access code...</div>;
  if (!accessCode) return null;

  const handleRevoke = async () => {
    try {
      await revokeCode(bookingId);
    } catch (error) {
      console.error('Failed to revoke access code:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Access Code</h3>
        
        <div className="text-3xl font-mono font-bold tracking-wider">
          {accessCode.code}
        </div>

        <div className="text-sm text-gray-600">
          Valid until: {new Date(accessCode.validUntil).toLocaleString()}
        </div>

        <div className="text-lg font-medium">
          Time remaining: {timeLeft}
        </div>

        {accessCode.status === 'ACTIVE' && (
          <Button
            onClick={handleRevoke}
            variant="secondary"
            className="mt-4"
          >
            Revoke Access Code
          </Button>
        )}

        {accessCode.status === 'EXPIRED' && (
          <div className="text-red-600">
            This access code has expired
          </div>
        )}
      </div>
    </div>
  );
}; 