import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRefreshSessionMutation } from '@/store/api/auth';
import { setSession, clearSession } from '@/store/slices/sessionSlice';

export const useSession = () => {
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.session);
  const [refreshSession] = useRefreshSessionMutation();

  useEffect(() => {
    const checkSession = async () => {
      if (!session.token) return;

      const expiresAt = new Date(session.expiresAt!);
      const now = new Date();
      
      // Refresh if expiring in next 5 minutes
      if (expiresAt.getTime() - now.getTime() < 300000) {
        try {
          const newSession = await refreshSession().unwrap();
          dispatch(setSession(newSession));
        } catch {
          dispatch(clearSession());
        }
      }
    };

    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [session.token, session.expiresAt]);

  return session;
}; 