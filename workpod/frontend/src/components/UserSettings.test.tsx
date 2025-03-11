import { render, fireEvent, screen } from '@testing-library/react';
import { UserSettings } from '../UserSettings';
import { render as customRender } from '../../test/test-utils';

describe('UserSettings', () => {
  it('should update user preferences', async () => {
    customRender(<UserSettings />);
    
    const notificationToggle = screen.getByRole('switch', { name: /notifications/i });
    fireEvent.click(notificationToggle);
    
    expect(await screen.findByText('Settings saved')).toBeInTheDocument();
  });

  it('should handle payment method updates', async () => {
    // Test payment method management
  });
}); 