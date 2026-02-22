import { HTTP } from './http';
import { Preferences } from '@capacitor/preferences';

const LOGIN_ENDPOINT = '';

export interface LoginResponse {
  status: 'ok' | 'error';
  token: string;
  user_name: string;
  user_email: string;
  user_id: number;
  message?: string;
}

export interface UserData {
  logged: boolean;
  name: string;
  email: string;
  id: number;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: UserData;
}

export class AuthService {
  static async login(pin: string): Promise<AuthResult> {
    try {
      const response = await HTTP.post<LoginResponse>(
        LOGIN_ENDPOINT,
        { pin },
        { timeout: 5000 },
      );

      if (response.data.status === 'ok') {
        const userData: UserData = {
          logged: true,
          name: response.data.user_name,
          email: response.data.user_email,
          id: response.data.user_id,
        };

        await Preferences.set({
          key: 'user_token',
          value: response.data.token,
        });

        await Preferences.set({
          key: 'user_data',
          value: JSON.stringify(userData),
        });

        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  static async logout(): Promise<void> {
    await Preferences.remove({ key: 'user_token' });
    await Preferences.remove({ key: 'user_data' });
  }

  static async isLoggedIn(): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'user_token' });
    return !!value;
  }

  static async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'user_token' });
    return value;
  }

  static async getUserData(): Promise<UserData | null> {
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      try {
        return JSON.parse(value) as UserData;
      } catch {
        return null;
      }
    }
    return null;
  }
}
