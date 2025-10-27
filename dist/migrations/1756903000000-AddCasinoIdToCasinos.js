"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCasinoIdToCasinos1756903000000 = void 0;
class AddCasinoIdToCasinos1756903000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "casinos" 
      ADD COLUMN "casino_id" varchar
    `);
        await queryRunner.query(`
      COMMENT ON COLUMN "casinos"."casino_id" IS 'External casino ID for third-party API integration'
    `);
    }
    async down(queryRunner) {
        const hasCasinoIdColumn = await queryRunner.hasColumn('casinos', 'casino_id');
        if (hasCasinoIdColumn) {
            await queryRunner.query(`
        ALTER TABLE "casinos" 
        DROP COLUMN "casino_id"
      `);
        }
    }
}
exports.AddCasinoIdToCasinos1756903000000 = AddCasinoIdToCasinos1756903000000;
//# sourceMappingURL=1756903000000-AddCasinoIdToCasinos.js.map