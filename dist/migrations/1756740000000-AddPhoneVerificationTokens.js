"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPhoneVerificationTokens1756740000000 = void 0;
const typeorm_1 = require("typeorm");
class AddPhoneVerificationTokens1756740000000 {
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('phone_verification_tokens');
        if (!tableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
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
            }), true);
            await queryRunner.query(`CREATE INDEX "IDX_phone_verification_tokens_user_id" ON "phone_verification_tokens" ("user_id")`);
            await queryRunner.query(`CREATE INDEX "IDX_phone_verification_tokens_token" ON "phone_verification_tokens" ("token")`);
            await queryRunner.query(`CREATE INDEX "IDX_phone_verification_tokens_expires_at" ON "phone_verification_tokens" ("expires_at")`);
        }
    }
    async down(queryRunner) {
        const tableExists = await queryRunner.hasTable('phone_verification_tokens');
        if (tableExists) {
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_phone_verification_tokens_expires_at"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_phone_verification_tokens_token"`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_phone_verification_tokens_user_id"`);
            await queryRunner.dropTable('phone_verification_tokens');
        }
    }
}
exports.AddPhoneVerificationTokens1756740000000 = AddPhoneVerificationTokens1756740000000;
//# sourceMappingURL=1756740000000-AddPhoneVerificationTokens.js.map