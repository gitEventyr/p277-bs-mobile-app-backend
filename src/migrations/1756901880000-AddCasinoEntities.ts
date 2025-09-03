import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCasinoEntities1756901880000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create casinos table
    const hasCasinosTable = await queryRunner.hasTable('casinos');
    if (!hasCasinosTable) {
      await queryRunner.query(`
        CREATE TABLE "casinos" (
          "id" bigserial NOT NULL,
          "casino_name" character varying NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_casinos_id" PRIMARY KEY ("id")
        )
      `);
    }

    // Create casino_actions table
    const hasCasinoActionsTable = await queryRunner.hasTable('casino_actions');
    if (!hasCasinoActionsTable) {
      await queryRunner.query(`
        CREATE TABLE "casino_actions" (
          "id" bigserial NOT NULL,
          "casino_id" bigint NOT NULL,
          "date_of_action" TIMESTAMP WITH TIME ZONE NOT NULL,
          "visitor_id" character varying NOT NULL,
          "registration" boolean NOT NULL DEFAULT false,
          "deposit" boolean NOT NULL DEFAULT false,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_casino_actions_id" PRIMARY KEY ("id")
        )
      `);

      // Add foreign key constraint to casinos table
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD CONSTRAINT "FK_casino_actions_casino_id" 
        FOREIGN KEY ("casino_id") REFERENCES "casinos"("id") 
        ON DELETE CASCADE ON UPDATE NO ACTION
      `);

      // Add foreign key constraint to players table via visitor_id
      await queryRunner.query(`
        ALTER TABLE "casino_actions" 
        ADD CONSTRAINT "FK_casino_actions_visitor_id" 
        FOREIGN KEY ("visitor_id") REFERENCES "players"("visitor_id") 
        ON DELETE CASCADE ON UPDATE NO ACTION
      `);

      // Add index on casino_id for better query performance
      await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_casino_id" ON "casino_actions" ("casino_id")
      `);

      // Add index on visitor_id for better query performance
      await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_visitor_id" ON "casino_actions" ("visitor_id")
      `);

      // Add index on date_of_action for better query performance
      await queryRunner.query(`
        CREATE INDEX "IDX_casino_actions_date_of_action" ON "casino_actions" ("date_of_action")
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop casino_actions table (this will also drop its foreign keys and indexes)
    const hasCasinoActionsTable = await queryRunner.hasTable('casino_actions');
    if (hasCasinoActionsTable) {
      await queryRunner.query(`DROP TABLE "casino_actions"`);
    }

    // Drop casinos table
    const hasCasinosTable = await queryRunner.hasTable('casinos');
    if (hasCasinosTable) {
      await queryRunner.query(`DROP TABLE "casinos"`);
    }
  }
}
