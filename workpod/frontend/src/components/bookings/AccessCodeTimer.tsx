import { useState, useEffect } from 'react';

interface AccessCodeTimerProps {
  validUntil: string;
  onExpired?: () => void;
}

export const AccessCodeTimer = ({ validUntil, onExpired }: AccessCodeTimerProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(validUntil);
      const diff = expiry.getTime() - now.getTime();

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
  }, [validUntil, onExpired]);

  const getTimerColor = () => {
    const timeRemaining = new Date(validUntil).getTime() - Date.now();
    if (timeRemaining <= 60000) return 'text-red-600'; // Last minute
    if (timeRemaining <= 300000) return 'text-yellow-600'; // Last 5 minutes
    return 'text-gray-600';
  };

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500">Time Remaining</div>
      <div className={`text-lg font-mono font-bold ${getTimerColor()}`}>
        {timeLeft}
      </div>
    </div>
  );
}; 