import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueToCasinoId1756910000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the column exists before adding constraint
    const hasCasinoIdColumn = await queryRunner.hasColumn(
      'casinos',
      'casino_id',
    );

    if (hasCasinoIdColumn) {
      // First, check if there are any duplicate casino_ids
      const duplicates = await queryRunner.query(`
        SELECT casino_id, COUNT(*)
        FROM casinos
        WHERE casino_id IS NOT NULL
        GROUP BY casino_id
        HAVING COUNT(*) > 1
      `);

      // If there are duplicates, we need to handle them
      // For now, we'll set duplicate casino_ids to NULL to allow the constraint
      if (duplicates.length > 0) {
        console.warn(
          'Warning: Found duplicate casino_ids. Setting duplicates to NULL to allow unique constraint.',
        );
        for (const duplicate of duplicates) {
          // Keep the first one, set others to NULL
          await queryRunner.query(
            `
            UPDATE casinos
            SET casino_id = NULL
            WHERE id NOT IN (
              SELECT MIN(id)
              FROM casinos
              WHERE casino_id = $1
              GROUP BY casino_id
            )
            AND casino_id = $1
          `,
            [duplicate.casino_id],
          );
        }
      }

      // Add unique constraint to casino_id
      await queryRunner.query(`
        ALTER TABLE "casinos"
        ADD CONSTRAINT "UQ_casinos_casino_id" UNIQUE ("casino_id")
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the constraint exists before dropping
    const table = await queryRunner.getTable('casinos');
    const uniqueConstraint = table?.uniques.find(
      (uq) => uq.name === 'UQ_casinos_casino_id',
    );

    if (uniqueConstraint) {
      await queryRunner.query(`
        ALTER TABLE "casinos"
        DROP CONSTRAINT "UQ_casinos_casino_id"
      `);
    }
  }
}
