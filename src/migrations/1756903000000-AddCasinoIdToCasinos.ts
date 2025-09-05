import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCasinoIdToCasinos1756903000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add casino_id column to casinos table
    await queryRunner.query(`
      ALTER TABLE "casinos" 
      ADD COLUMN "casino_id" varchar
    `);

    // Add comment to document the purpose
    await queryRunner.query(`
      COMMENT ON COLUMN "casinos"."casino_id" IS 'External casino ID for third-party API integration'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove casino_id column from casinos table
    const hasCasinoIdColumn = await queryRunner.hasColumn(
      'casinos',
      'casino_id',
    );
    if (hasCasinoIdColumn) {
      await queryRunner.query(`
        ALTER TABLE "casinos" 
        DROP COLUMN "casino_id"
      `);
    }
  }
}
