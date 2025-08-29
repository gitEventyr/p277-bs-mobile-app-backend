import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailPhoneVerification1756387500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add email verification fields to players table
    await queryRunner.query(`
      ALTER TABLE "players" 
      ADD "email_verified" boolean NOT NULL DEFAULT false,
      ADD "email_verified_at" timestamp with time zone,
      ADD "phone_verified" boolean NOT NULL DEFAULT false,
      ADD "phone_verified_at" timestamp with time zone
    `);

    // Create email_verification_tokens table
    await queryRunner.query(`
      CREATE TABLE "email_verification_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" varchar(6) NOT NULL,
        "user_id" bigint NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT "PK_email_verification_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_email_verification_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "players"("id") ON DELETE CASCADE
      )
    `);

    // Create phone_verification_tokens table
    await queryRunner.query(`
      CREATE TABLE "phone_verification_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" varchar(6) NOT NULL,
        "user_id" bigint NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT "PK_phone_verification_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_phone_verification_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "players"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_tokens_user_id" ON "email_verification_tokens" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_email_verification_tokens_token_used" ON "email_verification_tokens" ("token", "used")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phone_verification_tokens_user_id" ON "phone_verification_tokens" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phone_verification_tokens_token_used" ON "phone_verification_tokens" ("token", "used")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_phone_verification_tokens_token_used"`);
    await queryRunner.query(`DROP INDEX "IDX_phone_verification_tokens_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_tokens_token_used"`);
    await queryRunner.query(`DROP INDEX "IDX_email_verification_tokens_user_id"`);

    // Drop verification token tables
    await queryRunner.query(`DROP TABLE "phone_verification_tokens"`);
    await queryRunner.query(`DROP TABLE "email_verification_tokens"`);

    // Remove verification fields from players table
    await queryRunner.query(`
      ALTER TABLE "players" 
      DROP COLUMN "phone_verified_at",
      DROP COLUMN "phone_verified",
      DROP COLUMN "email_verified_at",
      DROP COLUMN "email_verified"
    `);
  }
}