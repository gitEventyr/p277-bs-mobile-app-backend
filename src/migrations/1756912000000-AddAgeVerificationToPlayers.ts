import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgeVerificationToPlayers1756912000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding (idempotent)
    const table = await queryRunner.getTable('players');

    if (!table?.findColumnByName('age_verified_at')) {
      await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verified_at" timestamp with time zone NULL
      `);
    }

    if (!table?.findColumnByName('age_verified_ip')) {
      await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verified_ip" text NULL
      `);
    }

    if (!table?.findColumnByName('age_verification_device')) {
      await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verification_device" bigint NULL
      `);
    }

    // Add foreign key constraint if column was just created
    if (!table?.findColumnByName('age_verification_device')) {
      await queryRunner.query(`
        ALTER TABLE "players"
        ADD CONSTRAINT "FK_players_age_verification_device"
        FOREIGN KEY ("age_verification_device")
        REFERENCES "devices"("id")
        ON DELETE SET NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "players"
      DROP CONSTRAINT IF EXISTS "FK_players_age_verification_device"
    `);

    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verification_device"
    `);

    await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verified_ip"
    `);

    await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verified_at"
    `);
  }
}
