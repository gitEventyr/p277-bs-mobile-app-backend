"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVoucherSystemEntities1756906000000 = void 0;
class UpdateVoucherSystemEntities1756906000000 {
    name = 'UpdateVoucherSystemEntities1756906000000';
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "users_vouchers"`);
        await queryRunner.query(`CREATE TYPE "vouchers_type_enum" AS ENUM('Amazon Gift Card', 'Other')`);
        await queryRunner.query(`CREATE TYPE "voucher_requests_status_enum" AS ENUM('requested', 'sent', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "cost"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "provider"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "img_url"`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "name" varchar NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "rp_price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "amazon_vouchers_equivalent" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "type" "vouchers_type_enum" NOT NULL`);
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "voucher_requests"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "voucher_requests_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "vouchers_type_enum"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "name"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "rp_price"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "amazon_vouchers_equivalent"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN IF EXISTS "type"`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "cost" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "provider" varchar NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "img_url" varchar NOT NULL`);
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
exports.UpdateVoucherSystemEntities1756906000000 = UpdateVoucherSystemEntities1756906000000;
//# sourceMappingURL=1756906000000-UpdateVoucherSystemEntities.js.map