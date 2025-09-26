import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEmailUniqueConstraint1756905000000 implements MigrationInterface {
  name = 'RemoveEmailUniqueConstraint1756905000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint on email field
    // Note: PostgreSQL constraint names are auto-generated, so we need to find the constraint name first
    const constraintResult = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'players'
      AND constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%email%'
    `);

    if (constraintResult.length > 0) {
      const constraintName = constraintResult[0].constraint_name;
      await queryRunner.query(
        `ALTER TABLE "players" DROP CONSTRAINT "${constraintName}"`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add the unique constraint on email field
    await queryRunner.query(
      `ALTER TABLE "players" ADD CONSTRAINT "UQ_players_email" UNIQUE ("email")`
    );
  }
}