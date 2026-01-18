import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User, BackgroundSync } from './entities';
import sqliteParams from './sqliteParams';
import { CreateUsersTable1768754422569 } from './migrations/1768754422569-CreateUsersTable';
import { CreateBackgroundSyncTable1768761130612 } from './migrations/1768761130612-CreateBackgroundSyncTable';

const dbName = 'yamagishi_inventory.db';

const dataSourceConfig: DataSourceOptions = {
  name: 'userConnection',
  type: 'capacitor',
  driver: sqliteParams.connection,
  database: dbName,
  mode: 'no-encryption',
  entities: [User, BackgroundSync],
  migrations: [CreateUsersTable1768754422569, CreateBackgroundSyncTable1768761130612],
  synchronize: false,
  migrationsRun: true,
  logging: false,
};

export const AppDataSource = new DataSource(dataSourceConfig);

export class DatabaseService {
  private static isInitialized = false;
  private static initializationPromise: Promise<void> | null = null;

  public static async initialize(): Promise<void> {
    if (this.isInitialized && AppDataSource.isInitialized) {
      console.log('Database already initialized');
      return;
    }

    if (this.initializationPromise) {
      console.log('Database initialization in progress, waiting...');
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private static async _doInitialize(): Promise<void> {
    try {
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
        }
      } catch (destroyError) {
        console.log('Error destroying existing connection:', destroyError);
      }

      try {
        const connection = sqliteParams.connection;

        try {
          const isConnection = await connection.isConnection(dbName, false);
          if (isConnection.result) {
            console.log('Closing existing Capacitor connection...');
            await connection.closeConnection(dbName, false);
          }
        } catch (e) {
          console.log('Connection check failed:', e);
        }

        try {
          await connection.closeAllConnections();
          console.log('Closed all connections');
        } catch (e) {
          console.log('Close all connections failed:', e);
        }

        try {
          console.log('Additional cleanup attempts...');
          await connection.closeConnection(dbName, false);
        } catch (e) {
          console.log('Additional cleanup failed:', e);
        }
      } catch (connectionError) {
        console.log('Connection cleanup failed:', connectionError);
      }

      await AppDataSource.initialize();

      this.isInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.isInitialized = false;

      if (
        error instanceof Error &&
        error.message &&
        error.message.includes('Connection yamagishi_inventory already exists')
      ) {
        console.log('Attempting to force cleanup and retry...');
        try {
          const connection = sqliteParams.connection;
          await connection.closeConnection(dbName, false);
          await AppDataSource.initialize();
          this.isInitialized = true;
          console.log('TypeORM setup complete after retry');
          return;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }

      throw error;
    }
  }


  public static getDataSource(): DataSource {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized');
    }
    return AppDataSource;
  }

  public static async close(): Promise<void> {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
      this.isInitialized = false;
      console.log('Database connection closed');
    } catch (error) {
      console.log('Database close error (this is normal):', error);
    }
  }
}
