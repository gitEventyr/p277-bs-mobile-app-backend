"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAgeVerificationToPlayers1756912000000 = void 0;
class AddAgeVerificationToPlayers1756912000000 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('players');
        if (!table?.findColumnByName('age_verified_at')) {
            await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verified_at" timestamp with time zone NULL
      `);
        }
        if (!table?.findColumnByName('age_verified_ip')) {
            await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verified_ip" text NULL
      `);
        }
        if (!table?.findColumnByName('age_verification_device')) {
            await queryRunner.query(`
        ALTER TABLE "players"
        ADD COLUMN "age_verification_device" bigint NULL
      `);
        }
        if (!table?.findColumnByName('age_verification_device')) {
            await queryRunner.query(`
        ALTER TABLE "players"
        ADD CONSTRAINT "FK_players_age_verification_device"
        FOREIGN KEY ("age_verification_device")
        REFERENCES "devices"("id")
        ON DELETE SET NULL
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP CONSTRAINT IF EXISTS "FK_players_age_verification_device"
    `);
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verification_device"
    `);
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verified_ip"
    `);
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN IF EXISTS "age_verified_at"
    `);
    }
}
exports.AddAgeVerificationToPlayers1756912000000 = AddAgeVerificationToPlayers1756912000000;
//# sourceMappingURL=1756912000000-AddAgeVerificationToPlayers.js.map