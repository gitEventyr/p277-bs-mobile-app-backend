"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAvatarToPlayers1756730050566 = void 0;
class AddAvatarToPlayers1756730050566 {
    async up(queryRunner) {
        const hasAvatarColumn = await queryRunner.hasColumn('players', 'avatar');
        if (!hasAvatarColumn) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                ADD COLUMN "avatar" text
            `);
        }
    }
    async down(queryRunner) {
        const hasAvatarColumn = await queryRunner.hasColumn('players', 'avatar');
        if (hasAvatarColumn) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                DROP COLUMN "avatar"
            `);
        }
    }
}
exports.AddAvatarToPlayers1756730050566 = AddAvatarToPlayers1756730050566;
//# sourceMappingURL=1756730050566-AddAvatarToPlayers.js.map