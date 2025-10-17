import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExperienceToPlayers1756911000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add experience column to players table
    await queryRunner.query(`
      ALTER TABLE "players"
      ADD COLUMN "experience" integer NOT NULL DEFAULT 0
    `);

    // Add check constraint to ensure experience is non-negative
    await queryRunner.query(`
      ALTER TABLE "players"
      ADD CONSTRAINT "CHK_players_experience_non_negative"
      CHECK ("experience" >= 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop check constraint
    await queryRunner.query(`
      ALTER TABLE "players"
      DROP CONSTRAINT IF EXISTS "CHK_players_experience_non_negative"
    `);

    // Drop experience column
    await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN "experience"
    `);
  }
}
