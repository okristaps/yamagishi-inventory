import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BackgroundSync } from '@/database/entities';
import { AppDataSource, DatabaseService } from '@/database/typeorm.config';

export class BackgroundSyncRepository {
  private static async ensureInitialized(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await DatabaseService.initialize();
    }
  }

  private static async getRepository(): Promise<Repository<BackgroundSync>> {
    await this.ensureInitialized();
    return AppDataSource.getRepository(BackgroundSync);
  }

  static async find(
    options?: FindManyOptions<BackgroundSync>,
  ): Promise<BackgroundSync[]> {
    return await (await this.getRepository()).find(options);
  }

  static async findOne(
    options: FindOneOptions<BackgroundSync>,
  ): Promise<BackgroundSync | null> {
    return await (await this.getRepository()).findOne(options);
  }

  static async save(
    backgroundSync: BackgroundSync | Partial<BackgroundSync>,
  ): Promise<BackgroundSync> {
    return await (await this.getRepository()).save(backgroundSync);
  }

  static async insert(
    syncData: Omit<BackgroundSync, 'id' | 'createdAt'>,
  ): Promise<any> {
    return await (await this.getRepository()).insert(syncData);
  }

  static async count(
    options?: FindManyOptions<BackgroundSync>,
  ): Promise<number> {
    return await (await this.getRepository()).count(options);
  }

  static async logTaskExecution(
    taskName: string,
    triggerSource: 'javascript' | 'java' | 'native' = 'javascript',
    appState: 'active' | 'background' | 'closed' = 'active',
    additionalData?: {
      userCount?: number;
      memoryUsage?: string;
      notes?: string;
    },
  ): Promise<BackgroundSync> {
    const syncData = {
      taskName,
      executionTime: new Date(),
      triggerSource,
      appState,
      userCount: additionalData?.userCount || 0,
      memoryUsage: additionalData?.memoryUsage,
      notes: additionalData?.notes,
    };

    return await this.save(syncData);
  }

  static async getRecentSyncHistory(limit = 50): Promise<BackgroundSync[]> {
    return await this.find({
      order: { executionTime: 'DESC' },
      take: limit,
    });
  }

  static async getSyncStatsByTask(): Promise<any[]> {
    const repository = await this.getRepository();

    const stats = await repository.query(`
      SELECT 
        task_name,
        COUNT(*) as execution_count,
        MAX(execution_time) as last_execution,
        trigger_source,
        app_state
      FROM background_sync 
      GROUP BY task_name, trigger_source, app_state 
      ORDER BY last_execution DESC
    `);

    return stats;
  }

  static async getRecentExecutions(
    minutesBack = 60,
  ): Promise<BackgroundSync[]> {
    const cutoffTime = new Date(Date.now() - minutesBack * 60 * 1000);

    return await this.find({
      where: {
        executionTime: { $gte: cutoffTime } as any,
      },
      order: { executionTime: 'DESC' },
    });
  }
}
