'use client';
import { BackgroundSyncRepository } from '@/repositories/BackgroundSyncRepository';

export interface MinuteTriggerPlugin {
  startTriggerService(): Promise<{ success: boolean; message: string }>;
  stopTriggerService(): Promise<{ success: boolean; message: string }>;
}

export interface TriggerEvent {
  timestamp: string;
  interval: string;
  interval_count: number;
  total_minutes: number;
  current_time: number;
}

export interface CronTask {
  id: string;
  name: string;
  intervalMinutes: number;
  lastRun?: number;
  callback: () => Promise<void>;
}

// Note: Plugin registration bypassed - using fallback approach

export class TriggerBasedCronService {
  private static instance: TriggerBasedCronService;
  private tasks: Map<string, CronTask> = new Map();
  private isInitialized = false;
  private lastTriggerTimeByInterval: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): TriggerBasedCronService {
    if (!TriggerBasedCronService.instance) {
      TriggerBasedCronService.instance = new TriggerBasedCronService();
    }
    return TriggerBasedCronService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.registerDefaultTasks();

      this.setupNativeEventListeners();

      // Start MinuteTriggerService for all interval triggers
      await this.startMinuteTriggerService();

      // Schedule WorkManager for background execution
      await this.scheduleWorkManagerTasks();

      this.isInitialized = true;
      console.log('TriggerBasedCronService initialized (hybrid mode)');
    } catch (error) {
      console.error('Failed to initialize TriggerBasedCronService:', error);
      throw error;
    }
  }

  private setupNativeEventListeners(): void {
    // Listen for cron trigger events from Java service
    if (typeof window !== 'undefined') {
      // Multi-interval triggers from MinuteTriggerService
      window.addEventListener('cronTrigger', (event: any) => {
        console.log('📨 Native cron trigger received:', event.detail);

        try {
          const triggerData = JSON.parse(event.detail);
          this.handleCronTrigger({
            timestamp: new Date(triggerData.timestamp).toISOString(),
            interval: triggerData.interval,
            interval_count: triggerData.interval_count,
            total_minutes: triggerData.total_minutes,
            current_time: triggerData.current_time,
          });
        } catch (error) {
          console.error('Failed to parse trigger data:', error);
        }
      });

    } else {
      console.warn(
        'Window not available, cannot register native event listeners',
      );
    }
  }

  private async startMinuteTriggerService(): Promise<void> {
    try {
      // Try multiple ways to access the MinuteTrigger plugin
      const { Capacitor } = await import('@capacitor/core');

      if (Capacitor.isNativePlatform()) {
        // Access via Capacitor.Plugins first
        if ((Capacitor as any).Plugins?.MinuteTriggerPlugin) {
          await (Capacitor as any).Plugins.MinuteTriggerPlugin.startTriggerService();
          return;
        }

        if (typeof window !== 'undefined' && (window as any).MinuteTrigger) {
          await (window as any).MinuteTrigger.startTriggerService();
          return;
        }

        console.warn('MinuteTriggerPlugin not found on native platform');
      } else {
        console.warn('MinuteTrigger not available on web platform');
      }
    } catch (error) {
      console.error('Failed to start MinuteTriggerService:', error);
    }
  }

  private async scheduleWorkManagerTasks(): Promise<void> {
    try {
      // Try multiple ways to access the WorkManager plugin
      const { Capacitor } = await import('@capacitor/core');

      if (Capacitor.isNativePlatform()) {
        // Access via Capacitor.Plugins first
        if ((Capacitor as any).Plugins?.WorkManagerPlugin) {
          await (Capacitor as any).Plugins.WorkManagerPlugin.schedulePeriodicTasks();
          return;
        }

        if (typeof window !== 'undefined' && (window as any).WorkManagerPlugin) {
          await (window as any).WorkManagerPlugin.schedulePeriodicTasks();
          return;
        }

        console.warn('WorkManagerPlugin not found on native platform');
      } else {
        console.warn('WorkManager not available on web platform');
      }
    } catch (error) {
      console.error('Failed to schedule WorkManager tasks:', error);
    }
  }

  private registerDefaultTasks(): void {
    this.addTask({
      id: 'heartbeat_sync',
      name: '1 Minute Task',
      intervalMinutes: 1,
      callback: async () => {
        console.log('1-MINUTE: App status check', new Date().toISOString());
      },
    });

    this.addTask({
      id: 'local_backup',
      name: '5 Minute Task',
      intervalMinutes: 5,
      callback: async () => {
        console.log(
          '5-MINUTE: Local user data backup',
          new Date().toISOString(),
        );
      },
    });

    this.addTask({
      id: 'inventory_sync',
      name: '15 Minute Task',
      intervalMinutes: 15,
      callback: async () => {
        console.log(
          '15-MINUTE: Inventory sync and validation',
          new Date().toISOString(),
        );
      },
    });

    // 30-minute: System health check and analytics
    this.addTask({
      id: 'health_analytics',
      name: '30 Minute Task',
      intervalMinutes: 30,
      callback: async () => {
        console.log(
          '30-MINUTE: System health and usage metrics',
          new Date().toISOString(),
        );
      },
    });

    this.addTask({
      id: 'database_maintenance',
      name: '60 Minute Task',
      intervalMinutes: 60,
      callback: async () => {
        console.log(
          '60-MINUTE: Database maintenance and cleanup',
          new Date().toISOString(),
        );
      },
    });

  }

  private async handleCronTrigger(event: TriggerEvent): Promise<void> {
    const now = Date.now();
    
    const isPendingTask = (event as any).source === 'workmanager' && (event as any).stored_at;
    const logTimestamp = isPendingTask ? new Date(event.current_time).toISOString() : new Date().toISOString();


    if (!isPendingTask) {
      const lastTimeForInterval =
        this.lastTriggerTimeByInterval.get(event.interval) || 0;
      if (now - lastTimeForInterval < 30000) {
        return;
      }
      this.lastTriggerTimeByInterval.set(event.interval, now);
    }

    const intervalMinutes = this.parseInterval(event.interval);
    if (intervalMinutes === null) {
      console.warn(`Unknown interval: ${event.interval}`);
      return;
    }

    for (const [, task] of Array.from(this.tasks.entries())) {
      if (task.intervalMinutes === intervalMinutes) {
        const shouldRun = isPendingTask || this.shouldTaskRun(task, now);

        if (shouldRun) {
          try {
            await task.callback();
            
            if (!isPendingTask) {
              task.lastRun = now;
            }

            await BackgroundSyncRepository.logTaskExecution(
              task.name,
              'java',
              isPendingTask ? 'background' : 'active',
              {
                notes: `${event.interval} task executed ${isPendingTask ? 'in background' : 'successfully'} at ${logTimestamp}`,
              },
            );

          } catch (error) {
            console.error(
              `${event.interval} task failed: ${task.name}`,
              error,
            );

            try {
              await BackgroundSyncRepository.logTaskExecution(
                task.name,
                'java',
                isPendingTask ? 'background' : 'active',
                {
                  notes: `${event.interval} task failed: ${error instanceof Error ? error.message : String(error)}`,
                },
              );
            } catch (logError) {
              console.error('Failed to log task failure:', logError);
            }
          }
        }
      }
    }
  }

  private parseInterval(interval: string): number | null {
    switch (interval) {
      case '1min':
        return 1;
      case '5min':
        return 5;
      case '15min':
        return 15;
      case '30min':
        return 30;
      case '60min':
        return 60;
      default:
        return null;
    }
  }

  private shouldTaskRun(task: CronTask, currentTime: number): boolean {
    if (!task.lastRun) {
      return true;
    }

    const minutesSinceLastRun = (currentTime - task.lastRun) / (1000 * 60);
    const shouldRun = minutesSinceLastRun >= task.intervalMinutes;


    return shouldRun;
  }

  addTask(task: CronTask): void {
    this.tasks.set(task.id, task);
  }

  removeTask(taskId: string): void {
    this.tasks.delete(taskId);
  }

  async getTaskStatus(): Promise<
    Array<{
      id: string;
      name: string;
      intervalMinutes: number;
      lastRun?: string;
      nextRun?: string;
    }>
  > {
    return Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      name: task.name,
      intervalMinutes: task.intervalMinutes,
      lastRun: task.lastRun ? new Date(task.lastRun).toISOString() : undefined,
      nextRun: task.lastRun
        ? new Date(
            task.lastRun + task.intervalMinutes * 60 * 1000,
          ).toISOString()
        : 'Next trigger',
    }));
  }

  async destroy(): Promise<void> {
    try {
      this.tasks.clear();
      this.isInitialized = false;

      const { Capacitor } = await import('@capacitor/core');

      if (Capacitor.isNativePlatform()) {
        try {
          if ((Capacitor as any).Plugins?.WorkManagerPlugin) {
            await (Capacitor as any).Plugins.WorkManagerPlugin.cancelAllTasks();
          }
          else if (
            typeof window !== 'undefined' &&
            (window as any).WorkManagerPlugin
          ) {
            await (window as any).WorkManagerPlugin.cancelAllTasks();
          }
        } catch (error) {
          console.warn('Failed to cancel WorkManager tasks:', error);
        }
      }

    } catch (error) {
      console.error('Failed to destroy TriggerBasedCronService:', error);
    }
  }
}

// Export singleton instance
export const triggerCron = TriggerBasedCronService.getInstance();
