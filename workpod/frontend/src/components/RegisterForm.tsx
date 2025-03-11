import { useState } from 'react';
import { useCreateAccountMutation } from '../store/api';

interface RegisterFormData {
  email: string;
  password: string;
  // ... other fields
}

export function RegisterForm() {
  const [createAccount, { isLoading, error }] = useCreateAccountMutation();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAccount(formData).unwrap();
      console.log('Registration successful:', result);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <form data-testid="register-form" onSubmit={handleSubmit}>
      <input
        data-testid="email-input"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        data-testid="password-input"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
} 