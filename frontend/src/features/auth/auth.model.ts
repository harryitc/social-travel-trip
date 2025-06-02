/**
 * Authentication models for the application
 */

// Login request model
export interface LoginRequest {
  username: string;
  password: string;
}

// Register request model
export interface RegisterRequest {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
}

// Reset password request model
export interface ResetPasswordRequest {
  email: string;
}

// Confirm reset password request model
export interface ConfirmResetPasswordRequest {
  token: string;
  password: string;
}

// Authentication response model
export interface AuthResponse {
  access_token: string;
}

// User model
export interface User {
  user_id: number;
  username: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}
