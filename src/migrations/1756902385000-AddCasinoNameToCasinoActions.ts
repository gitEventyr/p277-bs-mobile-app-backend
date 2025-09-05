import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCasinoNameToCasinoActions1756902385000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add casino_name column to casino_actions table
    const hasCasinoNameColumn = await queryRunner.hasColumn(
      'casino_actions',
      'casino_name',
    );
    if (!hasCasinoNameColumn) {
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD COLUMN "casino_name" character varying NOT NULL DEFAULT ''
      `);
    }

    // Update existing records to populate casino_name from casinos table
    await queryRunner.query(`
      UPDATE "casino_actions" 
      SET "casino_name" = "casinos"."casino_name"
      FROM "casinos" 
      WHERE "casino_actions"."casino_id" = "casinos"."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove casino_name column from casino_actions table
    const hasCasinoNameColumn = await queryRunner.hasColumn(
      'casino_actions',
      'casino_name',
    );
    if (hasCasinoNameColumn) {
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        DROP COLUMN "casino_name"
      `);
    }
  }
}
