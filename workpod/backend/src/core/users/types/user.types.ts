export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Pick<User, 'firstName' | 'lastName' | 'email'> {
  phone?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  language: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  timezone: string;
} 