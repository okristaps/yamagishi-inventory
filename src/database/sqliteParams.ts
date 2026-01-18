import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

let sqliteConnection: SQLiteConnection | null = null;

const getSQLiteConnection = () => {
  if (!sqliteConnection) {
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }
  return sqliteConnection;
};

const sqliteParams = {
  connection: getSQLiteConnection(),
  plugin: CapacitorSQLite,
  platform: Capacitor.getPlatform()
};

export default sqliteParams;