import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Product, InventoryTransaction } from './entities';

const DB_NAME = 'yamagishi_inventory.db';

export class DatabaseService {
  private static instance: DatabaseService;
  private dataSource: DataSource | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initializeDatabase(): Promise<DataSource> {
    if (this.dataSource && this.dataSource.isInitialized) {
      return this.dataSource;
    }

    try {
      // Initialize native SQLite connection
      await this.initializeNativeSQLite();

      // Create TypeORM DataSource for Capacitor
      this.dataSource = new DataSource({
        type: 'sqljs',
        database: new Uint8Array(),
        location: 'database',
        entities: [Product, InventoryTransaction],
        migrations: [], // Will be populated with migrations
        migrationsRun: false,
        logging: ['error', 'query'],
        synchronize: true, // For development - will auto-create tables
        autoSave: true,
      });

      await this.dataSource.initialize();
      console.log('Database initialized successfully');
      
      return this.dataSource;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async initializeNativeSQLite(): Promise<void> {
    try {
      // Check if database exists
      const dbExists = await CapacitorSQLite.isDatabase({ database: DB_NAME });
      
      if (!dbExists.result) {
        console.log('Creating new database:', DB_NAME);
        await CapacitorSQLite.createConnection({
          database: DB_NAME,
          version: 1,
          encrypted: false,
          mode: 'no-encryption',
          readonly: false,
        });
      } else {
        console.log('Opening existing database:', DB_NAME);
        await CapacitorSQLite.createConnection({
          database: DB_NAME,
          readonly: false,
        });
      }

      await CapacitorSQLite.open({ database: DB_NAME });
      console.log('SQLite connection established');
    } catch (error) {
      console.error('Failed to initialize native SQLite:', error);
      throw error;
    }
  }

  public async closeDatabase(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
    
    try {
      await CapacitorSQLite.close({ database: DB_NAME });
    } catch (error) {
      console.log('Database close error (this is normal):', error);
    }
  }

  public getDataSource(): DataSource | null {
    return this.dataSource;
  }
}

export const databaseService = DatabaseService.getInstance();