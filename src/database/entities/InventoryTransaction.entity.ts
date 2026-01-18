import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

@Entity('inventory_transactions')
export class InventoryTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  productId!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'text' })
  type!: TransactionType;

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'integer' })
  quantityBefore!: number;

  @Column({ type: 'integer' })
  quantityAfter!: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  reference?: string;

  @Column({ type: 'real', nullable: true })
  unitCost?: number;

  @CreateDateColumn()
  createdAt!: Date;
}