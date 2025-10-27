"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCasinoNameToCasinoActions1756902385000 = void 0;
class AddCasinoNameToCasinoActions1756902385000 {
    async up(queryRunner) {
        const hasCasinoNameColumn = await queryRunner.hasColumn('casino_actions', 'casino_name');
        if (!hasCasinoNameColumn) {
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD COLUMN "casino_name" character varying NOT NULL DEFAULT ''
      `);
        }
        await queryRunner.query(`
      UPDATE "casino_actions" 
      SET "casino_name" = "casinos"."casino_name"
      FROM "casinos" 
      WHERE "casino_actions"."casino_id" = "casinos"."id"
    `);
    }
    async down(queryRunner) {
        const hasCasinoNameColumn = await queryRunner.hasColumn('casino_actions', 'casino_name');
        if (hasCasinoNameColumn) {
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        DROP COLUMN "casino_name"
      `);
        }
    }
}
exports.AddCasinoNameToCasinoActions1756902385000 = AddCasinoNameToCasinoActions1756902385000;
//# sourceMappingURL=1756902385000-AddCasinoNameToCasinoActions.js.map