"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddExperienceToPlayers1756911000000 = void 0;
class AddExperienceToPlayers1756911000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "players"
      ADD COLUMN "experience" integer NOT NULL DEFAULT 0
    `);
        await queryRunner.query(`
      ALTER TABLE "players"
      ADD CONSTRAINT "CHK_players_experience_non_negative"
      CHECK ("experience" >= 0)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP CONSTRAINT IF EXISTS "CHK_players_experience_non_negative"
    `);
        await queryRunner.query(`
      ALTER TABLE "players"
      DROP COLUMN "experience"
    `);
    }
}
exports.AddExperienceToPlayers1756911000000 = AddExperienceToPlayers1756911000000;
//# sourceMappingURL=1756911000000-AddExperienceToPlayers.js.map