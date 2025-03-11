'use client';

import { useState, useEffect } from 'react';
import { useRefreshSessionMutation, useRevokeSessionMutation } from '@/store/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

export function SessionManager() {
  const { token, logout } = useAuth();
  const [refreshSession] = useRefreshSessionMutation();
  const [revokeSession] = useRevokeSessionMutation();
  const [sessions, setSessions] = useState<Array<{
    id: string;
    device: string;
    lastActive: string;
    current: boolean;
  }>>([]);

  useEffect(() => {
    // Refresh token before expiry
    const refreshInterval = setInterval(async () => {
      try {
        await refreshSession().unwrap();
      } catch (error) {
        debugLog('auth', 'Session refresh failed', { error });
        logout(); // Token expired or invalid
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(refreshInterval);
  }, [refreshSession, logout]);

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId).unwrap();
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      showToast.success('Session revoked successfully');
    } catch (error) {
      debugLog('auth', 'Session revocation failed', { error });
      showToast.error('Failed to revoke session');
    }
  };

  return (
    <div className="session-manager">
      <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <div 
            key={session.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-medium">{session.device}</p>
              <p className="text-sm text-gray-500">
                Last active: {new Date(session.lastActive).toLocaleString()}
              </p>
              {session.current && (
                <span className="text-xs text-green-500">Current session</span>
              )}
            </div>
            
            {!session.current && (
              <button
                onClick={() => handleRevoke(session.id)}
                className="text-red-600 hover:text-red-800"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 