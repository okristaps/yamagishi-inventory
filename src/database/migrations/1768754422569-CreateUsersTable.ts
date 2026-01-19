import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1768754422569 implements MigrationInterface {
    name = 'CreateUsersTable1768754422569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                name           TEXT NOT NULL,
                email          TEXT DEFAULT NULL,
                telephone      TEXT DEFAULT NULL,
                apps_login_pin TEXT DEFAULT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users;`);
    }

}
