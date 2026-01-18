import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('background_sync')
export class BackgroundSync {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'task_name' })
  taskName!: string;

  @Column({ name: 'execution_time' })
  executionTime!: Date;

  @Column({ name: 'trigger_source', default: 'javascript' })
  triggerSource!: 'javascript' | 'java' | 'native';

  @Column({ name: 'app_state', default: 'active' })
  appState!: 'active' | 'background' | 'closed';

  @Column({ name: 'user_count', default: 0 })
  userCount!: number;

  @Column({ name: 'memory_usage', type: 'text', nullable: true })
  memoryUsage?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}