"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveEmailUniqueConstraint1756905000000 = void 0;
class RemoveEmailUniqueConstraint1756905000000 {
    name = 'RemoveEmailUniqueConstraint1756905000000';
    async up(queryRunner) {
        const constraintResult = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'players'
      AND constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%email%'
    `);
        if (constraintResult.length > 0) {
            const constraintName = constraintResult[0].constraint_name;
            await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "${constraintName}"`);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "UQ_players_email" UNIQUE ("email")`);
    }
}
exports.RemoveEmailUniqueConstraint1756905000000 = RemoveEmailUniqueConstraint1756905000000;
//# sourceMappingURL=1756905000000-RemoveEmailUniqueConstraint.js.map