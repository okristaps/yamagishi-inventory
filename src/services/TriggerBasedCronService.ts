'use client';
import { BackgroundSyncRepository } from '@/repositories/BackgroundSyncRepository';

export interface MinuteTriggerPlugin {
  startTriggerService(): Promise<{ success: boolean; message: string }>;
  stopTriggerService(): Promise<{ success: boolean; message: string }>;
}

export interface TriggerEvent {
  timestamp: string;
  trigger_count: number;
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
  private lastTriggerTime = 0;

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
      // Register default tasks
      this.registerDefaultTasks();

      // For now, simulate the trigger system with a JavaScript interval
      // The Java service will start automatically via MainActivity
      this.startJavaScriptFallback();

      this.isInitialized = true;
      console.log('✅ TriggerBasedCronService initialized (fallback mode)');
      console.log('📱 Java service will start automatically when app opens');
    } catch (error) {
      console.error('Failed to initialize TriggerBasedCronService:', error);
      throw error;
    }
  }

  private startJavaScriptFallback(): void {
    // Start a JavaScript-based minute trigger as fallback
    setInterval(() => {
      const now = Date.now();
      const timestamp = new Date().toISOString();

      console.log(`⏰ JS Fallback trigger: ${timestamp}`);

      this.handleMinuteTrigger({
        timestamp,
        trigger_count: Math.floor(now / 60000), // Approximate count
        current_time: now,
      });
    }, 60000); // 1 minute
  }

  private registerDefaultTasks(): void {
    // 1-minute test task
    this.addTask({
      id: 'test_1min',
      name: 'Test 1 Minute',
      intervalMinutes: 1,
      callback: async () => {
        console.log('🔥 1-MINUTE TASK EXECUTED:', new Date().toISOString());
      },
    });

    // 2-minute test task
    this.addTask({
      id: 'test_2min',
      name: 'Test 2 Minutes',
      intervalMinutes: 2,
      callback: async () => {
        console.log('⚡ 2-MINUTE TASK EXECUTED:', new Date().toISOString());
      },
    });

    console.log('Default tasks registered:', Array.from(this.tasks.keys()));
  }

  private async handleMinuteTrigger(event: TriggerEvent): Promise<void> {
    const now = Date.now();

    console.log(
      `📅 Minute trigger received: ${event.timestamp} (count: ${event.trigger_count})`,
    );

    // Prevent duplicate processing if triggers come too quickly
    if (now - this.lastTriggerTime < 30000) {
      // Less than 30 seconds
      console.log('⏩ Skipping trigger - too soon after last one');
      return;
    }

    this.lastTriggerTime = now;

    // Check each task to see if it should run
    for (const [taskId, task] of Array.from(this.tasks.entries())) {
      const shouldRun = this.shouldTaskRun(task, now);

      if (shouldRun) {
        console.log(`🚀 Running task: ${task.name} (${taskId})`);
        try {
          // Execute the task
          await task.callback();
          task.lastRun = now;

          // Log execution to database
          await BackgroundSyncRepository.logTaskExecution(
            task.name,
            'javascript', // Since we're using JS fallback for now
            'active', // App is active since JS is running
            {
              notes: `Task executed successfully at ${new Date().toISOString()}`,
            },
          );

          console.log(`✅ Task completed: ${task.name}`);
        } catch (error) {
          console.error(`❌ Task failed: ${task.name}`, error);

          // Log failure to database
          try {
            await BackgroundSyncRepository.logTaskExecution(
              task.name,
              'javascript',
              'active',
              {
                notes: `Task failed: ${error instanceof Error ? error.message : String(error)}`,
              },
            );
          } catch (logError) {
            console.error('Failed to log task failure:', logError);
          }
        }
      }
    }
  }

  private shouldTaskRun(task: CronTask, currentTime: number): boolean {
    if (!task.lastRun) {
      // First run - execute immediately
      return true;
    }

    const minutesSinceLastRun = (currentTime - task.lastRun) / (1000 * 60);
    const shouldRun = minutesSinceLastRun >= task.intervalMinutes;

    if (shouldRun) {
      console.log(
        `⏰ Task ${task.name} due: ${minutesSinceLastRun.toFixed(1)} min since last run (interval: ${task.intervalMinutes} min)`,
      );
    }

    return shouldRun;
  }

  addTask(task: CronTask): void {
    this.tasks.set(task.id, task);
    console.log(
      `➕ Added task: ${task.name} (every ${task.intervalMinutes} minutes)`,
    );
  }

  removeTask(taskId: string): void {
    this.tasks.delete(taskId);
    console.log(`➖ Removed task: ${taskId}`);
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
      console.log('🛑 TriggerBasedCronService destroyed');
    } catch (error) {
      console.error('Failed to destroy TriggerBasedCronService:', error);
    }
  }
}

// Export singleton instance
export const triggerCron = TriggerBasedCronService.getInstance();
