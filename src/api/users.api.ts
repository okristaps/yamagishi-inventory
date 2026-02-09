import { HTTP } from './http';

export interface ApiUser {
  id: number;
  name: string;
  email: string | null;
  telephone: string | null;
  apps_login_pin: string | null;
}

export interface UsersListResponse {
  users: ApiUser[];
}

export class UsersApi {
  static async list() {
    return HTTP.post<UsersListResponse>('users');
  }
}
