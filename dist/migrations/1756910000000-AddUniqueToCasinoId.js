"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUniqueToCasinoId1756910000000 = void 0;
class AddUniqueToCasinoId1756910000000 {
    async up(queryRunner) {
        const hasCasinoIdColumn = await queryRunner.hasColumn('casinos', 'casino_id');
        if (hasCasinoIdColumn) {
            const duplicates = await queryRunner.query(`
        SELECT casino_id, COUNT(*)
        FROM casinos
        WHERE casino_id IS NOT NULL
        GROUP BY casino_id
        HAVING COUNT(*) > 1
      `);
            if (duplicates.length > 0) {
                console.warn('Warning: Found duplicate casino_ids. Setting duplicates to NULL to allow unique constraint.');
                for (const duplicate of duplicates) {
                    await queryRunner.query(`
            UPDATE casinos
            SET casino_id = NULL
            WHERE id NOT IN (
              SELECT MIN(id)
              FROM casinos
              WHERE casino_id = $1
              GROUP BY casino_id
            )
            AND casino_id = $1
          `, [duplicate.casino_id]);
                }
            }
            await queryRunner.query(`
        ALTER TABLE "casinos"
        ADD CONSTRAINT "UQ_casinos_casino_id" UNIQUE ("casino_id")
      `);
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('casinos');
        const uniqueConstraint = table?.uniques.find((uq) => uq.name === 'UQ_casinos_casino_id');
        if (uniqueConstraint) {
            await queryRunner.query(`
        ALTER TABLE "casinos"
        DROP CONSTRAINT "UQ_casinos_casino_id"
      `);
        }
    }
}
exports.AddUniqueToCasinoId1756910000000 = AddUniqueToCasinoId1756910000000;
//# sourceMappingURL=1756910000000-AddUniqueToCasinoId.js.map