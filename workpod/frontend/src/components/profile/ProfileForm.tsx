import { useResendVerificationEmailMutation } from '@/store/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

export function ProfileForm() {
  const { user } = useAuth();
  const [resendVerification, { isLoading: resending }] = useResendVerificationEmailMutation();

  const handleResendVerification = async () => {
    try {
      await resendVerification().unwrap();
      showToast.success('Verification email sent');
    } catch (error) {
      debugLog('auth', 'Failed to resend verification', { error });
      showToast.error('Failed to send verification email');
    }
  };

  {!user.emailVerified && (
    <div className="mt-2 flex items-center space-x-2">
      <span className="text-sm text-yellow-600">Email not verified</span>
      <button
        onClick={handleResendVerification}
        disabled={resending}
        className="text-sm text-blue-600 hover:underline"
      >
        {resending ? 'Sending...' : 'Resend verification email'}
      </button>
    </div>
  )}
} 