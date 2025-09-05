import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCasinoIdFromCasinoActions1756902493000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add unique constraint to casino_name in casinos table
    await queryRunner.query(`
      ALTER TABLE "casinos" 
      ADD CONSTRAINT "UQ_casinos_casino_name" UNIQUE ("casino_name")
    `);

    // Remove foreign key constraint from casino_actions table
    await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      DROP CONSTRAINT IF EXISTS "FK_casino_actions_casino_id"
    `);

    // Drop index on casino_id
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_casino_actions_casino_id"
    `);

    // Remove casino_id column from casino_actions table
    const hasCasinoIdColumn = await queryRunner.hasColumn(
      'casino_actions',
      'casino_id',
    );
    if (hasCasinoIdColumn) {
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        DROP COLUMN "casino_id"
      `);
    }

    // Add foreign key constraint from casino_actions.casino_name to casinos.casino_name
    await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      ADD CONSTRAINT "FK_casino_actions_casino_name" 
      FOREIGN KEY ("casino_name") REFERENCES "casinos"("casino_name") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Add index on casino_name for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_casino_actions_casino_name" ON "casino_actions" ("casino_name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraint on casino_name
    await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      DROP CONSTRAINT IF EXISTS "FK_casino_actions_casino_name"
    `);

    // Drop index on casino_name
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_casino_actions_casino_name"
    `);

    // Add back casino_id column to casino_actions table
    const hasCasinoIdColumn = await queryRunner.hasColumn(
      'casino_actions',
      'casino_id',
    );
    if (!hasCasinoIdColumn) {
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD COLUMN "casino_id" bigint
      `);

      // Update casino_id with values from casinos table based on casino_name
      await queryRunner.query(`
        UPDATE "casino_actions" 
        SET "casino_id" = "casinos"."id"
        FROM "casinos" 
        WHERE "casino_actions"."casino_name" = "casinos"."casino_name"
      `);

      // Make casino_id NOT NULL after populating it
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ALTER COLUMN "casino_id" SET NOT NULL
      `);
    }

    // Add back foreign key constraint on casino_id
    await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      ADD CONSTRAINT "FK_casino_actions_casino_id" 
      FOREIGN KEY ("casino_id") REFERENCES "casinos"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add back index on casino_id
    await queryRunner.query(`
      CREATE INDEX "IDX_casino_actions_casino_id" ON "casino_actions" ("casino_id")
    `);

    // Remove unique constraint from casino_name in casinos table
    await queryRunner.query(`
      ALTER TABLE "casinos" 
      DROP CONSTRAINT IF EXISTS "UQ_casinos_casino_name"
    `);
  }
}
