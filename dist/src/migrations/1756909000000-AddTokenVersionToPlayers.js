"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenVersionToPlayers1756909000000 = void 0;
class AddTokenVersionToPlayers1756909000000 {
    async up(queryRunner) {
        const hasTokenVersionColumn = await queryRunner.hasColumn('players', 'token_version');
        if (!hasTokenVersionColumn) {
            await queryRunner.query(`
                ALTER TABLE "players"
                ADD COLUMN "token_version" integer DEFAULT 0 NOT NULL
            `);
        }
    }
    async down(queryRunner) {
        const hasTokenVersionColumn = await queryRunner.hasColumn('players', 'token_version');
        if (hasTokenVersionColumn) {
            await queryRunner.query(`
                ALTER TABLE "players"
                DROP COLUMN "token_version"
            `);
        }
    }
}
exports.AddTokenVersionToPlayers1756909000000 = AddTokenVersionToPlayers1756909000000;
//# sourceMappingURL=1756909000000-AddTokenVersionToPlayers.js.map