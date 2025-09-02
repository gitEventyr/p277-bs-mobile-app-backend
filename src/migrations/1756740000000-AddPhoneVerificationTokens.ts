import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddPhoneVerificationTokens1756740000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table already exists
    const tableExists = await queryRunner.hasTable('phone_verification_tokens');
    
    if (!tableExists) {
      // Create phone_verification_tokens table
      await queryRunner.createTable(
        new Table({
          name: 'phone_verification_tokens',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'token',
              type: 'varchar',
              length: '6',
            },
            {
              name: 'user_id',
              type: 'bigint',
            },
            {
              name: 'expires_at',
              type: 'timestamp with time zone',
            },
            {
              name: 'used',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp with time zone',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
          foreignKeys: [
            {
              name: 'FK_phone_verification_tokens_user',
              columnNames: ['user_id'],
              referencedTableName: 'players',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            },
          ],
        }),
        true,
      );

      // Create indexes using raw SQL
      await queryRunner.query(
        `CREATE INDEX "IDX_phone_verification_tokens_user_id" ON "phone_verification_tokens" ("user_id")`,
      );

      await queryRunner.query(
        `CREATE INDEX "IDX_phone_verification_tokens_token" ON "phone_verification_tokens" ("token")`,
      );

      await queryRunner.query(
        `CREATE INDEX "IDX_phone_verification_tokens_expires_at" ON "phone_verification_tokens" ("expires_at")`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('phone_verification_tokens');
    
    if (tableExists) {
      // Drop indexes using raw SQL
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_phone_verification_tokens_expires_at"`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_phone_verification_tokens_token"`,
      );
      await queryRunner.query(
        `DROP INDEX IF EXISTS "IDX_phone_verification_tokens_user_id"`,
      );

      // Drop table
      await queryRunner.dropTable('phone_verification_tokens');
    }
  }
}