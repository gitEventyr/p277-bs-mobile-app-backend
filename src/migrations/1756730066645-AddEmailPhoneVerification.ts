import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailPhoneVerification1756730066645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "players" 
            ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false,
            ADD COLUMN "email_verified_at" timestamp with time zone,
            ADD COLUMN "phone_verified" boolean NOT NULL DEFAULT false,
            ADD COLUMN "phone_verified_at" timestamp with time zone
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "players" 
            DROP COLUMN "phone_verified_at",
            DROP COLUMN "phone_verified",
            DROP COLUMN "email_verified_at",
            DROP COLUMN "email_verified"
        `);
    }

}
