import { DataSource } from 'typeorm';
import { User } from './src/database/entities';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'yamagishi_inventory.db',
  synchronize: false,
  logging: false,
  entities: ['src/database/entities/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: ['src/database/subscribers/**/*.ts'],
});

export default AppDataSource;