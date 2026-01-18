import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  sku?: string;

  @Column({ type: 'text', nullable: true })
  barcode?: string;

  @Column({ type: 'real', default: 0 })
  price!: number;

  @Column({ type: 'integer', default: 0 })
  quantity!: number;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'integer', default: 0 })
  minimumStock!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}