import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/apis/auth.api';
import { User, LoginCredentials, RegisterData, VerifyOtpData } from '@/types/auth';
import { getErrorMessage } from '@/lib/utils';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastFetched: number | null;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })() : null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('user') : false,
  lastFetched: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Login failed'));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      if (response.success) {
        return response.message;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Registration failed'));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: VerifyOtpData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Verification failed'));
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data: { email: string; type: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtp(data);
      if (response.success) {
        return response.message;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to resend OTP'));
    }
  }
);

export const fetchProfile = createAsyncThunk<
  User,
  { force?: boolean } | void,
  { state: { auth: AuthState } }
>(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch profile'));
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      if (arg && typeof arg === 'object' && arg.force) {
        return true;
      }
      // If a fetch is already in flight, skip dispatch
      if (state.auth?.isLoading) {
        return false;
      }
      return true;
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update profile'));
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authApi.uploadAvatar(formData);
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to upload avatar'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout API failed:", e);
    }
    dispatch(logout());
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      // Legacy - session token is handled by httpOnly cookies now
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    updateUserPlan: (state, action: PayloadAction<{ plan: 'FREE' | 'PRO'; planExpiresAt?: string | null; tokens?: number; user?: User }>) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      } else if (state.user) {
        state.user.plan = action.payload.plan;
        if (action.payload.planExpiresAt !== undefined) {
          state.user.planExpiresAt = action.payload.planExpiresAt;
        }
        if (action.payload.tokens !== undefined) {
          state.user.tokens = action.payload.tokens;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
    deductTokens: (state, action: PayloadAction<number | undefined>) => {
      const amount = action.payload ?? 0.5;
      if (state.user && state.user.tokens !== undefined) {
        state.user.tokens = Math.max(0, Number((state.user.tokens - amount).toFixed(2)));
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = null;
        state.isAuthenticated = true;
        state.lastFetched = Date.now();
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = null;
        state.isAuthenticated = true;
        state.lastFetched = Date.now();
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setToken, setUser, updateUserPlan, deductTokens } = authSlice.actions;
export default authSlice.reducer;
