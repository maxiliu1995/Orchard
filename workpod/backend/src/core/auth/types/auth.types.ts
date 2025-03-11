export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type SignupResult = {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
};

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    lastLoginAt?: Date;
  };
  accessToken: string;
  refreshToken?: string;
  token?: string;
} 