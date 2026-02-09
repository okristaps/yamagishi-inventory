import { UsersApi } from '@/api';
import { UserRepository } from '@/database/repositories/UserRepository';

export interface SyncResult {
  success: boolean;
  count?: number;
  error?: string;
}

export class UsersService {
  static async sync(): Promise<SyncResult> {
    try {
      const response = await UsersApi.list();
      const users = response.data.users;

      let syncedCount = 0;
      for (const user of users) {
        await UserRepository.save({
          id: user.id,
          name: user.name,
          email: user.email || undefined,
          telephone: user.telephone || undefined,
          appsLoginPin: user.apps_login_pin || undefined,
        });
        syncedCount++;
      }

      return {
        success: true,
        count: syncedCount,
      };
    } catch (error) {
      console.error('Error syncing users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync users',
      };
    }
  }
}
