import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1000000000000 implements MigrationInterface {
  name = 'InitialSetup1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create products table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "sku" TEXT,
        "barcode" TEXT,
        "price" REAL NOT NULL DEFAULT 0,
        "quantity" INTEGER NOT NULL DEFAULT 0,
        "category" TEXT,
        "location" TEXT,
        "minimumStock" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create inventory_transactions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_transactions" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "productId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "quantityBefore" INTEGER NOT NULL,
        "quantityAfter" INTEGER NOT NULL,
        "reason" TEXT,
        "reference" TEXT,
        "unitCost" REAL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("productId") REFERENCES "products" ("id")
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_PRODUCTS_SKU" ON "products" ("sku")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_PRODUCTS_BARCODE" ON "products" ("barcode")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_TRANSACTIONS_PRODUCT" ON "inventory_transactions" ("productId")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_TRANSACTIONS_TYPE" ON "inventory_transactions" ("type")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_TRANSACTIONS_TYPE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_TRANSACTIONS_PRODUCT"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_BARCODE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_SKU"`);
    
    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}