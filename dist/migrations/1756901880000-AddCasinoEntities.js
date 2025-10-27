"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCasinoEntities1756901880000 = void 0;
class AddCasinoEntities1756901880000 {
    async up(queryRunner) {
        const hasCasinosTable = await queryRunner.hasTable('casinos');
        if (!hasCasinosTable) {
            await queryRunner.query(`
        CREATE TABLE "casinos" (
          "id" bigserial NOT NULL,
          "casino_name" character varying NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_casinos_id" PRIMARY KEY ("id")
        )
      `);
        }
        const hasCasinoActionsTable = await queryRunner.hasTable('casino_actions');
        if (!hasCasinoActionsTable) {
            await queryRunner.query(`
        CREATE TABLE "casino_actions" (
          "id" bigserial NOT NULL,
          "casino_id" bigint NOT NULL,
          "date_of_action" TIMESTAMP WITH TIME ZONE NOT NULL,
          "visitor_id" character varying NOT NULL,
          "registration" boolean NOT NULL DEFAULT false,
          "deposit" boolean NOT NULL DEFAULT false,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_casino_actions_id" PRIMARY KEY ("id")
        )
      `);
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD CONSTRAINT "FK_casino_actions_casino_id" 
        FOREIGN KEY ("casino_id") REFERENCES "casinos"("id") 
        ON DELETE CASCADE ON UPDATE NO ACTION
      `);
            await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD CONSTRAINT "FK_casino_actions_visitor_id" 
        FOREIGN KEY ("visitor_id") REFERENCES "players"("visitor_id") 
        ON DELETE CASCADE ON UPDATE NO ACTION
      `);
            await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_casino_id" ON "casino_actions" ("casino_id")
      `);
            await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_visitor_id" ON "casino_actions" ("visitor_id")
      `);
            await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_date_of_action" ON "casino_actions" ("date_of_action")
      `);
        }
    }
    async down(queryRunner) {
        const hasCasinoActionsTable = await queryRunner.hasTable('casino_actions');
        if (hasCasinoActionsTable) {
            await queryRunner.query(`DROP TABLE "casino_actions"`);
        }
        const hasCasinosTable = await queryRunner.hasTable('casinos');
        if (hasCasinosTable) {
            await queryRunner.query(`DROP TABLE "casinos"`);
        }
    }
}
exports.AddCasinoEntities1756901880000 = AddCasinoEntities1756901880000;
//# sourceMappingURL=1756901880000-AddCasinoEntities.js.map