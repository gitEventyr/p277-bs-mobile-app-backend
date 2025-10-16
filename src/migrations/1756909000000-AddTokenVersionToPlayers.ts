import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenVersionToPlayers1756909000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if token_version column already exists
    const hasTokenVersionColumn = await queryRunner.hasColumn(
      'players',
      'token_version',
    );

    if (!hasTokenVersionColumn) {
      await queryRunner.query(`
                ALTER TABLE "players"
                ADD COLUMN "token_version" integer DEFAULT 0 NOT NULL
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if token_version column exists before dropping
    const hasTokenVersionColumn = await queryRunner.hasColumn(
      'players',
      'token_version',
    );

    if (hasTokenVersionColumn) {
      await queryRunner.query(`
                ALTER TABLE "players"
                DROP COLUMN "token_version"
            `);
    }
  }
}
