import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToPlayers1756730050566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "players" 
            ADD COLUMN "avatar" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "players" 
            DROP COLUMN "avatar"
        `);
    }

}
