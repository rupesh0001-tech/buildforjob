import api from './axiosInstance';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  VerifyOtpData, 
  ProfileResponse,
  ApiResponse,
  User
} from '@/types/auth';

let activeProfilePromise: Promise<ProfileResponse> | null = null;

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/verify/otp', data);
    return response.data;
  },

  resendOtp: async (data: { email: string; type: string }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/verify/resend-otp', data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    if (activeProfilePromise) {
      return activeProfilePromise;
    }
    activeProfilePromise = api.get<ProfileResponse>('/user/profile')
      .then(res => res.data)
      .finally(() => {
        activeProfilePromise = null;
      });
    return activeProfilePromise;
  },

  updateProfile: async (data: Partial<User>): Promise<ProfileResponse> => {
    const response = await api.patch<ProfileResponse>('/user/profile', data);
    return response.data;
  },

  uploadAvatar: async (formData: FormData): Promise<ProfileResponse> => {
    const response = await api.post<ProfileResponse>('/user/avatar', formData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  forgotPassword: async (data: { email: string }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  }
};
