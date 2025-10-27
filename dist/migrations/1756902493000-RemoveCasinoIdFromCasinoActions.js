"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCasinoIdFromCasinoActions1756902493000 = void 0;
class RemoveCasinoIdFromCasinoActions1756902493000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "casinos" 
      ADD CONSTRAINT "UQ_casinos_casino_name" UNIQUE ("casino_name")
    `);
        await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      DROP CONSTRAINT IF EXISTS "FK_casino_actions_casino_id"
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_casino_actions_casino_id"
    `);
        const hasCasinoIdColumn = await queryRunner.hasColumn('casino_actions', 'casino_id');
        if (hasCasinoIdColumn) {
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        DROP COLUMN "casino_id"
      `);
        }
        await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      ADD CONSTRAINT "FK_casino_actions_casino_name" 
      FOREIGN KEY ("casino_name") REFERENCES "casinos"("casino_name") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_casino_actions_casino_name" ON "casino_actions" ("casino_name")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      DROP CONSTRAINT IF EXISTS "FK_casino_actions_casino_name"
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_casino_actions_casino_name"
    `);
        const hasCasinoIdColumn = await queryRunner.hasColumn('casino_actions', 'casino_id');
        if (!hasCasinoIdColumn) {
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD COLUMN "casino_id" bigint
      `);
            await queryRunner.query(`
        UPDATE "casino_actions" 
        SET "casino_id" = "casinos"."id"
        FROM "casinos" 
        WHERE "casino_actions"."casino_name" = "casinos"."casino_name"
      `);
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ALTER COLUMN "casino_id" SET NOT NULL
      `);
        }
        await queryRunner.query(`
      ALTER TABLE "casino_actions" 
      ADD CONSTRAINT "FK_casino_actions_casino_id" 
      FOREIGN KEY ("casino_id") REFERENCES "casinos"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_casino_actions_casino_id" ON "casino_actions" ("casino_id")
    `);
        await queryRunner.query(`
      ALTER TABLE "casinos" 
      DROP CONSTRAINT IF EXISTS "UQ_casinos_casino_name"
    `);
    }
}
exports.RemoveCasinoIdFromCasinoActions1756902493000 = RemoveCasinoIdFromCasinoActions1756902493000;
//# sourceMappingURL=1756902493000-RemoveCasinoIdFromCasinoActions.js.map