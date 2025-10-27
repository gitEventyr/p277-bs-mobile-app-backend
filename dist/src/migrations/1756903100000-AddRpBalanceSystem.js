"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRpBalanceSystem1756903100000 = void 0;
class AddRpBalanceSystem1756903100000 {
    name = 'AddRpBalanceSystem1756903100000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "players" ADD "rp_balance" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`
      CREATE TABLE "rp_balance_transactions" (
        "id" BIGSERIAL NOT NULL,
        "user_id" bigint NOT NULL,
        "balance_before" double precision NOT NULL,
        "balance_after" double precision NOT NULL,
        "amount" double precision NOT NULL,
        "mode" character varying(100) NOT NULL,
        "reason" text,
        "admin_id" character varying(50),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rp_balance_transactions" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "rp_balance_transactions" 
      ADD CONSTRAINT "FK_rp_balance_transactions_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_rp_balance_transactions_user_id" ON "rp_balance_transactions" ("user_id")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_rp_balance_transactions_created_at" ON "rp_balance_transactions" ("created_at")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_rp_balance_transactions_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_rp_balance_transactions_user_id"`);
        await queryRunner.query(`ALTER TABLE "rp_balance_transactions" DROP CONSTRAINT "FK_rp_balance_transactions_user_id"`);
        await queryRunner.query(`DROP TABLE "rp_balance_transactions"`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "rp_balance"`);
    }
}
exports.AddRpBalanceSystem1756903100000 = AddRpBalanceSystem1756903100000;
//# sourceMappingURL=1756903100000-AddRpBalanceSystem.js.map