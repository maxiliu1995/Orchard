import { useState, useEffect } from 'react';
import { useGetAccessCodeQuery, useUnlockPodMutation } from '@/store/api/access';
import { useSocket } from '@/contexts/SocketContext';
import { motion, PanInfo } from 'framer-motion';
import { PodDoor } from '@/components/pods/PodDoor';
import { Button } from '@/components/ui/Button';
import { AccessCodeTimer } from './AccessCodeTimer';

interface AccessCodeProps {
  bookingId: string;
  onCheckInSuccess?: () => void;
}

export const AccessCode = ({ bookingId, onCheckInSuccess }: AccessCodeProps) => {
  const { data: accessCode, isLoading, refetch } = useGetAccessCodeQuery(bookingId);
  const [unlockPod, { isLoading: isUnlocking }] = useUnlockPodMutation();
  const { socket } = useSocket();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (socket) {
      socket.on('access-code:updated', (data: { bookingId: string }) => {
        if (data.bookingId === bookingId) {
          // Refetch access code
          refetch();
        }
      });
    }
  }, [socket, bookingId]);

  useEffect(() => {
    if (!accessCode) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const validUntil = new Date(accessCode.validUntil);
      const diff = validUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    return () => clearInterval(timer);
  }, [accessCode]);

  const handleUnlock = async () => {
    try {
      await unlockPod(bookingId);
      onCheckInSuccess?.();
    } catch (error) {
      console.error('Unlock failed:', error);
    }
  };

  const handleExpired = () => {
    refetch(); // Refresh access code status
  };

  if (isLoading) return <div>Loading access code...</div>;
  if (!accessCode) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Access Code</h3>
      
      <div className="space-y-6">
        <PodDoor 
          isOpen={accessCode.status !== 'ACTIVE'}
          isUnlocking={isUnlocking}
        />

        <div className="text-center">
          <div className="text-3xl font-mono font-bold tracking-wider mb-2">
            {accessCode.code}
          </div>
          <AccessCodeTimer 
            validUntil={accessCode.validUntil}
            onExpired={handleExpired}
          />
        </div>

        <div className="border-t pt-4">
          {accessCode.status === 'ACTIVE' ? (
            <Button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full"
            >
              {isUnlocking ? 'Unlocking...' : 'Unlock Pod'}
            </Button>
          ) : accessCode.status === 'EXPIRED' ? (
            <div className="text-center text-red-600">
              Access code has expired
            </div>
          ) : (
            <div className="text-center text-green-600">
              Pod unlocked! You can now enter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 