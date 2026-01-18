import 'reflect-metadata';
import { databaseService } from '../database.config';
import { Product, InventoryTransaction, TransactionType } from '../entities';

export class DatabaseInitService {
  private static initialized = false;

  public static async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log('Initializing database...');
      const dataSource = await databaseService.initializeDatabase();
      
      if (dataSource && dataSource.isInitialized) {
        console.log('Database initialized successfully');
        console.log('Running migrations...');
        
        await dataSource.runMigrations();
        console.log('Migrations completed');

        await this.seedSampleData(dataSource);
        
        this.initialized = true;
      } else {
        throw new Error('Failed to initialize database');
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private static async seedSampleData(dataSource: any): Promise<void> {
    try {
      const productRepo = dataSource.getRepository(Product);
      const existingCount = await productRepo.count();
      
      if (existingCount > 0) {
        console.log('Database already has data, skipping seed');
        return;
      }

      console.log('Seeding sample data...');
      
      const sampleProducts = [
        {
          name: 'Laptop Computer',
          description: 'High-performance laptop for business use',
          sku: 'LAP-001',
          barcode: '1234567890123',
          price: 999.99,
          quantity: 25,
          category: 'Electronics',
          location: 'Warehouse A-1',
          minimumStock: 5,
          isActive: true
        },
        {
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with USB receiver',
          sku: 'MOU-001',
          barcode: '1234567890124',
          price: 29.99,
          quantity: 150,
          category: 'Electronics',
          location: 'Warehouse B-2',
          minimumStock: 20,
          isActive: true
        },
        {
          name: 'Office Chair',
          description: 'Comfortable ergonomic office chair',
          sku: 'CHR-001',
          barcode: '1234567890125',
          price: 249.99,
          quantity: 8,
          category: 'Furniture',
          location: 'Warehouse C-3',
          minimumStock: 3,
          isActive: true
        }
      ];

      for (const productData of sampleProducts) {
        const product = productRepo.create(productData);
        await productRepo.save(product);
        
        // Create initial stock transaction
        const transactionRepo = dataSource.getRepository(InventoryTransaction);
        const transaction = transactionRepo.create({
          productId: product.id,
          type: TransactionType.IN,
          quantity: productData.quantity,
          quantityBefore: 0,
          quantityAfter: productData.quantity,
          reason: 'Initial stock',
          reference: 'SEED-DATA'
        });
        await transactionRepo.save(transaction);
      }

      console.log('Sample data seeded successfully');
    } catch (error) {
      console.error('Failed to seed sample data:', error);
      throw error;
    }
  }

  public static async isInitialized(): Promise<boolean> {
    return this.initialized;
  }
}