"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEmailPhoneVerification1756730066645 = void 0;
class AddEmailPhoneVerification1756730066645 {
    async up(queryRunner) {
        const hasEmailVerified = await queryRunner.hasColumn('players', 'email_verified');
        const hasEmailVerifiedAt = await queryRunner.hasColumn('players', 'email_verified_at');
        const hasPhoneVerified = await queryRunner.hasColumn('players', 'phone_verified');
        const hasPhoneVerifiedAt = await queryRunner.hasColumn('players', 'phone_verified_at');
        const columnsToAdd = [];
        if (!hasEmailVerified)
            columnsToAdd.push('ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false');
        if (!hasEmailVerifiedAt)
            columnsToAdd.push('ADD COLUMN "email_verified_at" timestamp with time zone');
        if (!hasPhoneVerified)
            columnsToAdd.push('ADD COLUMN "phone_verified" boolean NOT NULL DEFAULT false');
        if (!hasPhoneVerifiedAt)
            columnsToAdd.push('ADD COLUMN "phone_verified_at" timestamp with time zone');
        if (columnsToAdd.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                ${columnsToAdd.join(',\n                ')}
            `);
        }
    }
    async down(queryRunner) {
        const hasEmailVerified = await queryRunner.hasColumn('players', 'email_verified');
        const hasEmailVerifiedAt = await queryRunner.hasColumn('players', 'email_verified_at');
        const hasPhoneVerified = await queryRunner.hasColumn('players', 'phone_verified');
        const hasPhoneVerifiedAt = await queryRunner.hasColumn('players', 'phone_verified_at');
        const columnsToDrop = [];
        if (hasPhoneVerifiedAt)
            columnsToDrop.push('DROP COLUMN "phone_verified_at"');
        if (hasPhoneVerified)
            columnsToDrop.push('DROP COLUMN "phone_verified"');
        if (hasEmailVerifiedAt)
            columnsToDrop.push('DROP COLUMN "email_verified_at"');
        if (hasEmailVerified)
            columnsToDrop.push('DROP COLUMN "email_verified"');
        if (columnsToDrop.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                ${columnsToDrop.join(',\n                ')}
            `);
        }
    }
}
exports.AddEmailPhoneVerification1756730066645 = AddEmailPhoneVerification1756730066645;
//# sourceMappingURL=1756730066645-AddEmailPhoneVerification.js.map