import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLoginMutation, useLogoutMutation } from '@/store/api';
import type { User } from '@/types/api.types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();

  return { user, login, logout };
}; 