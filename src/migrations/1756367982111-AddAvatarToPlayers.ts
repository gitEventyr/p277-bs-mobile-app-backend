import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarToPlayers1756367982111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add avatar column to players table for base64 encoded avatar images
    await queryRunner.query(`ALTER TABLE "players" ADD "avatar" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove avatar column from players table
    await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "avatar"`);
  }
}
