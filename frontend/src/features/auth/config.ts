import { API_ENDPOINT } from '@/config/api.config';

export const APIS = {
  login: `${API_ENDPOINT.social_travel_trip}/auth/login`,
  register: `${API_ENDPOINT.social_travel_trip}/auth/register`,
  resetPassword: `${API_ENDPOINT.social_travel_trip}/auth/reset-password`,
  confirmResetPassword: `${API_ENDPOINT.social_travel_trip}/auth/reset-password/confirm`,
};

export type TLoginPayload = {
  username: string;
  password: string;
};

export type TRegisterPayload = {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
};

export type TResetPasswordPayload = {
  email: string;
};

export type TConfirmResetPasswordPayload = {
  token: string;
  password: string;
};
