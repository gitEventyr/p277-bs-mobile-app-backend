import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVoucherSystemEntities1756906000000
  implements MigrationInterface
{
  name = 'UpdateVoucherSystemEntities1756906000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing users_vouchers table
    await queryRunner.query(`DROP TABLE IF EXISTS "users_vouchers"`);

    // Create enum type for voucher types
    await queryRunner.query(
      `CREATE TYPE "vouchers_type_enum" AS ENUM('Amazon Gift Card', 'Other')`,
    );

    // Create enum type for voucher request statuses
    await queryRunner.query(
      `CREATE TYPE "voucher_requests_status_enum" AS ENUM('requested', 'sent', 'canceled')`,
    );

    // Update vouchers table structure
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "cost"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "provider"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "img_url"`,
    );

    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "name" varchar NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "rp_price" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "amazon_vouchers_equivalent" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "type" "vouchers_type_enum" NOT NULL`,
    );

    // Create new voucher_requests table
    await queryRunner.query(`
      CREATE TABLE "voucher_requests" (
        "id" BIGSERIAL NOT NULL,
        "user_id" bigint NOT NULL,
        "voucher_id" bigint NOT NULL,
        "request_date" timestamp with time zone NOT NULL,
        "status" "voucher_requests_status_enum" NOT NULL DEFAULT 'requested',
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT "PK_voucher_requests" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "voucher_requests"
      ADD CONSTRAINT "FK_voucher_requests_user_id"
      FOREIGN KEY ("user_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "voucher_requests"
      ADD CONSTRAINT "FK_voucher_requests_voucher_id"
      FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop voucher_requests table
    await queryRunner.query(`DROP TABLE IF EXISTS "voucher_requests"`);

    // Drop enum types
    await queryRunner.query(
      `DROP TYPE IF EXISTS "voucher_requests_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "vouchers_type_enum"`);

    // Restore original vouchers table structure
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "rp_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "amazon_vouchers_equivalent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "type"`,
    );

    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "cost" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "provider" varchar NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "img_url" varchar NOT NULL`,
    );

    // Recreate users_vouchers table
    await queryRunner.query(`
      CREATE TABLE "users_vouchers" (
        "id" BIGSERIAL NOT NULL,
        "user_id" bigint NOT NULL,
        "voucher_id" bigint NOT NULL,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_vouchers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "users_vouchers"
      ADD CONSTRAINT "FK_users_vouchers_user_id"
      FOREIGN KEY ("user_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "users_vouchers"
      ADD CONSTRAINT "FK_users_vouchers_voucher_id"
      FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }
}
