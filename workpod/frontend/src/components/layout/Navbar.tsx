import { User } from '@/types/api.types';

interface NavbarProps {
  user: User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold">WorkPod</div>
        <div>{user ? user.email : 'Login'}</div>
      </div>
    </nav>
  );
}; 