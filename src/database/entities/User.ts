import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true, default: null })
  email?: string;

  @Column({ type: 'text', nullable: true, default: null })
  telephone?: string;

  @Column({ type: 'text', nullable: true, default: null, name: 'apps_login_pin' })
  appsLoginPin?: string;
}