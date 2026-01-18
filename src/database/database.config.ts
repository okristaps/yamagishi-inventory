import { DataSource } from 'typeorm';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Product, InventoryTransaction } from './entities';
import { InitialSetup1000000000000 } from './migrations';

const DB_NAME = 'yamagishi_inventory.db';

export class DatabaseService {
  private static instance: DatabaseService;
  private dataSource: DataSource | null = null;
  private sqliteConnection: any = null;

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
      // Initialize SQLite connection
      if (Capacitor.isNativePlatform()) {
        await this.initializeNativeSQLite();
      } else {
        await this.initializeWebSQLite();
      }

      // Create TypeORM DataSource
      this.dataSource = new DataSource({
        type: 'capacitor',
        driver: CapacitorSQLite,
        database: DB_NAME,
        mode: 'no-encryption',
        entities: [Product, InventoryTransaction],
        migrations: [InitialSetup1000000000000],
        migrationsRun: true,
        logging: ['error', 'query'],
        synchronize: false, // Always false for production safety
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
    // Check if database exists
    const dbExists = await CapacitorSQLite.isDatabase({ database: DB_NAME });
    
    if (!dbExists.result) {
      // Create database if it doesn't exist
      this.sqliteConnection = await CapacitorSQLite.createConnection({
        database: DB_NAME,
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
        readonly: false,
      });
    } else {
      // Open existing database
      this.sqliteConnection = await CapacitorSQLite.createConnection({
        database: DB_NAME,
        readonly: false,
      });
    }

    await CapacitorSQLite.open({ database: DB_NAME });
  }

  private async initializeWebSQLite(): Promise<void> {
    // For web platform, initialize jeep-sqlite
    const jeepSqlite = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSqlite);
    
    await customElements.whenDefined('jeep-sqlite');
    await CapacitorSQLite.initWebStore();
    
    this.sqliteConnection = await CapacitorSQLite.createConnection({
      database: DB_NAME,
      version: 1,
      encrypted: false,
      mode: 'no-encryption',
      readonly: false,
    });

    await CapacitorSQLite.open({ database: DB_NAME });
  }

  public async closeDatabase(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
    
    if (this.sqliteConnection) {
      await CapacitorSQLite.close({ database: DB_NAME });
    }
  }

  public getDataSource(): DataSource | null {
    return this.dataSource;
  }
}

export const databaseService = DatabaseService.getInstance();