import { CapacitorSQLite } from '@capacitor-community/sqlite';

const DB_NAME = 'yamagishi_inventory.db';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  price: number;
  quantity: number;
  category?: string;
  location?: string;
  minimumStock: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SimpleDatabaseService {
  private static instance: SimpleDatabaseService;
  private isInitialized = false;
  private connectionExists = false;

  private constructor() {}

  public static getInstance(): SimpleDatabaseService {
    if (!SimpleDatabaseService.instance) {
      SimpleDatabaseService.instance = new SimpleDatabaseService();
    }
    return SimpleDatabaseService.instance;
  }

  private async checkConnection(): Promise<boolean> {
    try {
      // Try to check if database exists and connection is available
      const dbExists = await CapacitorSQLite.isDatabase({ database: DB_NAME });
      return (dbExists.result ?? false) && this.connectionExists;
    } catch (error) {
      console.log('Error checking connection:', error);
      return false;
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Initializing database...');

      // Check if connection already exists
      const hasConnection = await this.checkConnection();

      if (!hasConnection) {
        try {
          // Check if database file exists
          const dbExists = await CapacitorSQLite.isDatabase({
            database: DB_NAME,
          });

          if (!(dbExists.result ?? false)) {
            console.log('Creating new database:', DB_NAME);
          } else {
            console.log('Database file exists, creating connection:', DB_NAME);
          }

          await CapacitorSQLite.createConnection({
            database: DB_NAME,
            version: 1,
            encrypted: false,
            mode: 'no-encryption',
            readonly: false,
          });
          this.connectionExists = true;
        } catch (createError: any) {
          if (
            createError?.message?.includes('Connection') &&
            createError?.message?.includes('already exists')
          ) {
            console.log('Connection already exists, continuing:', DB_NAME);
            this.connectionExists = true;
          } else {
            throw createError;
          }
        }
      } else {
        console.log('Connection already exists for:', DB_NAME);
        this.connectionExists = true;
      }

      // Only try to open if we have a connection and it's not already open
      try {
        await CapacitorSQLite.open({ database: DB_NAME });
        console.log('SQLite connection established');
      } catch (openError: any) {
        if (openError?.message?.includes('already open')) {
          console.log('Database is already open');
        } else {
          throw openError;
        }
      }

      // Create tables
      await this.createTables();

      // Seed data if needed
      await this.seedSampleData();

      this.isInitialized = true;
      console.log('Database setup complete');
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    try {
      const createProductsTable =
        'CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, sku TEXT, barcode TEXT, price REAL DEFAULT 0, quantity INTEGER DEFAULT 0, category TEXT, location TEXT, minimumStock INTEGER DEFAULT 0, isActive BOOLEAN DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)';

      const createTransactionsTable =
        'CREATE TABLE IF NOT EXISTS inventory_transactions (id TEXT PRIMARY KEY, productId TEXT NOT NULL, type TEXT NOT NULL, quantity INTEGER NOT NULL, quantityBefore INTEGER NOT NULL, quantityAfter INTEGER NOT NULL, reason TEXT, reference TEXT, unitCost REAL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (productId) REFERENCES products (id))';

      // Try using run instead of execute
      await CapacitorSQLite.run({
        database: DB_NAME,
        statement: createProductsTable,
        values: [],
      });

      await CapacitorSQLite.run({
        database: DB_NAME,
        statement: createTransactionsTable,
        values: [],
      });

      console.log('Tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  private async seedSampleData(): Promise<void> {
    try {
      // Check if data already exists
      const result = await CapacitorSQLite.query({
        database: DB_NAME,
        statement: 'SELECT COUNT(*) as count FROM products',
        values: [],
      });

      const count = result.values?.[0]?.count || 0;
      if (count > 0) {
        console.log('Database already has data, skipping seed');
        return;
      }

      console.log('Seeding sample data...');


      console.log('Sample data seeded successfully');
    } catch (error) {
      console.error('Failed to seed sample data:', error);
      throw error;
    }
  }

  public async getAllProducts(): Promise<Product[]> {
    try {
      const result = await CapacitorSQLite.query({
        database: DB_NAME,
        statement:
          'SELECT * FROM products WHERE isActive = 1 ORDER BY name ASC',
        values: [],
      });

      return result.values || [];
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await CapacitorSQLite.close({ database: DB_NAME });
    } catch (error) {
      console.log('Database close error (this is normal):', error);
    }
  }
}

export const simpleDatabaseService = SimpleDatabaseService.getInstance();
