"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsureCasinoActionsVisitorIdFK1756908000000 = void 0;
class EnsureCasinoActionsVisitorIdFK1756908000000 {
    name = 'EnsureCasinoActionsVisitorIdFK1756908000000';
    async up(queryRunner) {
        const constraintExists = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'casino_actions'
        AND constraint_name = 'FK_609382032637fbe3cd5d96757bd'
        AND constraint_type = 'FOREIGN KEY'
    `);
        if (constraintExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "casino_actions"
         ADD CONSTRAINT "FK_609382032637fbe3cd5d96757bd"
         FOREIGN KEY ("visitor_id") REFERENCES "players"("visitor_id")
         ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }
    }
    async down(queryRunner) {
        const constraintExists = await queryRunner.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'casino_actions'
        AND constraint_name = 'FK_609382032637fbe3cd5d96757bd'
        AND constraint_type = 'FOREIGN KEY'
    `);
        if (constraintExists.length > 0) {
            await queryRunner.query(`ALTER TABLE "casino_actions" DROP CONSTRAINT "FK_609382032637fbe3cd5d96757bd"`);
        }
    }
}
exports.EnsureCasinoActionsVisitorIdFK1756908000000 = EnsureCasinoActionsVisitorIdFK1756908000000;
//# sourceMappingURL=1756908000000-EnsureCasinoActionsVisitorIdFK.js.map