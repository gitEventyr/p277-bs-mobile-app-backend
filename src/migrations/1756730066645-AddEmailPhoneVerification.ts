import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailPhoneVerification1756730066645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check which columns already exist
        const hasEmailVerified = await queryRunner.hasColumn("players", "email_verified");
        const hasEmailVerifiedAt = await queryRunner.hasColumn("players", "email_verified_at");
        const hasPhoneVerified = await queryRunner.hasColumn("players", "phone_verified");
        const hasPhoneVerifiedAt = await queryRunner.hasColumn("players", "phone_verified_at");
        
        // Add columns that don't exist
        const columnsToAdd: string[] = [];
        if (!hasEmailVerified) columnsToAdd.push('ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false');
        if (!hasEmailVerifiedAt) columnsToAdd.push('ADD COLUMN "email_verified_at" timestamp with time zone');
        if (!hasPhoneVerified) columnsToAdd.push('ADD COLUMN "phone_verified" boolean NOT NULL DEFAULT false');
        if (!hasPhoneVerifiedAt) columnsToAdd.push('ADD COLUMN "phone_verified_at" timestamp with time zone');
        
        if (columnsToAdd.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                ${columnsToAdd.join(',\n                ')}
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check which columns exist before dropping
        const hasEmailVerified = await queryRunner.hasColumn("players", "email_verified");
        const hasEmailVerifiedAt = await queryRunner.hasColumn("players", "email_verified_at");
        const hasPhoneVerified = await queryRunner.hasColumn("players", "phone_verified");
        const hasPhoneVerifiedAt = await queryRunner.hasColumn("players", "phone_verified_at");
        
        // Drop columns that exist (in reverse order)
        const columnsToDrop: string[] = [];
        if (hasPhoneVerifiedAt) columnsToDrop.push('DROP COLUMN "phone_verified_at"');
        if (hasPhoneVerified) columnsToDrop.push('DROP COLUMN "phone_verified"');
        if (hasEmailVerifiedAt) columnsToDrop.push('DROP COLUMN "email_verified_at"');
        if (hasEmailVerified) columnsToDrop.push('DROP COLUMN "email_verified"');
        
        if (columnsToDrop.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players" 
                ${columnsToDrop.join(',\n                ')}
            `);
        }
    }

}
