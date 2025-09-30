import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnsureCasinoActionsVisitorIdFK1756908000000
  implements MigrationInterface
{
  name = 'EnsureCasinoActionsVisitorIdFK1756908000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the foreign key constraint exists
    const constraintExists = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'casino_actions'
        AND constraint_name = 'FK_609382032637fbe3cd5d96757bd'
        AND constraint_type = 'FOREIGN KEY'
    `);

    // If the constraint doesn't exist, create it
    if (constraintExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "casino_actions"
         ADD CONSTRAINT "FK_609382032637fbe3cd5d96757bd"
         FOREIGN KEY ("visitor_id") REFERENCES "players"("visitor_id")
         ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the constraint exists before trying to drop it
    const constraintExists = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'casino_actions'
        AND constraint_name = 'FK_609382032637fbe3cd5d96757bd'
        AND constraint_type = 'FOREIGN KEY'
    `);

    if (constraintExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "casino_actions" DROP CONSTRAINT "FK_609382032637fbe3cd5d96757bd"`,
      );
    }
  }
}