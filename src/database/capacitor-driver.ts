import { CapacitorSQLite } from '@capacitor-community/sqlite';

export class CapacitorSQLiteConnection {
  private database: string;
  private isConnected: boolean = false;

  constructor(database: string) {
    this.database = database;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const dbExists = await CapacitorSQLite.isDatabase({ database: this.database });
      
      if (!dbExists.result) {
        console.log('Creating new database:', this.database);
      }

      await CapacitorSQLite.createConnection({
        database: this.database,
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
        readonly: false,
      });

      await CapacitorSQLite.open({ database: this.database });
      this.isConnected = true;
      console.log('CapacitorSQLite connection established');
    } catch (error: any) {
      if (error?.message?.includes('Connection') && error?.message?.includes('already exists')) {
        console.log('Connection already exists, continuing');
        await CapacitorSQLite.open({ database: this.database });
        this.isConnected = true;
      } else if (error?.message?.includes('already open')) {
        console.log('Database is already open');
        this.isConnected = true;
      } else {
        throw error;
      }
    }
  }

  async close(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await CapacitorSQLite.close({ database: this.database });
      this.isConnected = false;
    } catch (error) {
      console.log('Database close error (this is normal):', error);
      this.isConnected = false;
    }
  }

  async query(sql: string, parameters: any[] = []): Promise<any[]> {
    await this.connect();
    
    try {
      const result = await CapacitorSQLite.query({
        database: this.database,
        statement: sql,
        values: parameters.map(param => param === null || param === undefined ? '' : String(param)),
      });
      return result.values || [];
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async execute(sql: string, parameters: any[] = []): Promise<any> {
    await this.connect();
    
    try {
      const result = await CapacitorSQLite.run({
        database: this.database,
        statement: sql,
        values: parameters.map(param => param === null || param === undefined ? '' : String(param)),
      });
      return result.changes;
    } catch (error) {
      console.error('Execute failed:', error);
      throw error;
    }
  }

  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}