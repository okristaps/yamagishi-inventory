import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBackgroundSyncTable1768761130612 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS background_sync (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                task_name      TEXT NOT NULL,
                execution_time DATETIME NOT NULL,
                trigger_source TEXT NOT NULL DEFAULT 'javascript',
                app_state      TEXT NOT NULL DEFAULT 'active',
                user_count     INTEGER DEFAULT 0,
                memory_usage   TEXT DEFAULT NULL,
                notes          TEXT DEFAULT NULL,
                created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_background_sync_execution_time 
            ON background_sync(execution_time);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_background_sync_task_name 
            ON background_sync(task_name);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS background_sync;`);
    }

}
