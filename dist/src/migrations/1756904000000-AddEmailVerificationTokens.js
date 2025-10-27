"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEmailVerificationTokens1756904000000 = void 0;
const typeorm_1 = require("typeorm");
class AddEmailVerificationTokens1756904000000 {
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('email_verification_tokens');
        if (!tableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'email_verification_tokens',
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
                        name: 'FK_email_verification_tokens_user',
                        columnNames: ['user_id'],
                        referencedTableName: 'players',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                ],
            }), true);
            await queryRunner.query(`CREATE INDEX "IDX_email_verification_tokens_user_id" ON "email_verification_tokens" ("user_id")`);
            await queryRunner.query(`CREATE INDEX "IDX_email_verification_tokens_token" ON "email_verification_tokens" ("token")`);
            await queryRunner.query(`CREATE INDEX "IDX_email_verification_tokens_expires_at" ON "email_verification_tokens" ("expires_at")`);
        }
    }
    async down(queryRunner) {
        const tableExists = await queryRunner.hasTable('email_verification_tokens');
        if (tableExists) {
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_email_verification_tokens_expires_at"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_email_verification_tokens_token"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_email_verification_tokens_user_id"`);
            await queryRunner.dropTable('email_verification_tokens');
        }
    }
}
exports.AddEmailVerificationTokens1756904000000 = AddEmailVerificationTokens1756904000000;
//# sourceMappingURL=1756904000000-AddEmailVerificationTokens.js.map