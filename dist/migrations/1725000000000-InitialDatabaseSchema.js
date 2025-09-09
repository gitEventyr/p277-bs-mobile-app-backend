"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialDatabaseSchema1725000000000 = void 0;
const typeorm_1 = require("typeorm");
class InitialDatabaseSchema1725000000000 {
    name = 'InitialDatabaseSchema1725000000000';
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'players',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'visitor_id',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'email',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'phone',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'coins_balance',
                    type: 'double precision',
                    default: 0,
                },
                {
                    name: 'level',
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'pid',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'c',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_channel',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_adset',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_ad',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_keywords',
                    type: 'text',
                    isArray: true,
                    isNullable: true,
                },
                {
                    name: 'is_retargeting',
                    type: 'boolean',
                    isNullable: true,
                },
                {
                    name: 'af_click_lookback',
                    type: 'smallint',
                    isNullable: true,
                },
                {
                    name: 'af_viewthrough_lookback',
                    type: 'smallint',
                    isNullable: true,
                },
                {
                    name: 'af_sub1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_sub2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_sub3',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_sub4',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'af_sub5',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'auth_user_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'age_checkbox',
                    type: 'boolean',
                    isNullable: true,
                },
                {
                    name: 'scratch_cards',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'device_udid',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'subscription_agreement',
                    type: 'boolean',
                    isNullable: true,
                },
                {
                    name: 'tnc_agreement',
                    type: 'boolean',
                    isNullable: true,
                },
                {
                    name: 'os',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'device',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'is_deleted',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp with time zone',
                    isNullable: true,
                },
                {
                    name: 'deletion_reason',
                    type: 'text',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'IDX_players_visitor_id',
                    columnNames: ['visitor_id'],
                },
                {
                    name: 'IDX_players_email',
                    columnNames: ['email'],
                },
                {
                    name: 'IDX_players_is_deleted',
                    columnNames: ['is_deleted'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'admin_users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'email',
                    type: 'text',
                    isUnique: true,
                },
                {
                    name: 'password_hash',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'display_name',
                    type: 'text',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'last_login_at',
                    type: 'timestamp with time zone',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_admin_users_email',
                    columnNames: ['email'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'devices',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'bigint',
                },
                {
                    name: 'udid',
                    type: 'varchar',
                },
                {
                    name: 'os_type',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'os_version',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'browser',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'ip',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'city',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'country',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'isp',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'timezone',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'device_fb_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'logged_at',
                    type: 'timestamp with time zone',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_devices_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_devices_udid',
                    columnNames: ['udid'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'coins_balance_changes',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'bigint',
                },
                {
                    name: 'balance_before',
                    type: 'double precision',
                },
                {
                    name: 'balance_after',
                    type: 'double precision',
                },
                {
                    name: 'amount',
                    type: 'double precision',
                },
                {
                    name: 'mode',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_coins_balance_changes_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_coins_balance_changes_mode',
                    columnNames: ['mode'],
                },
                {
                    name: 'IDX_coins_balance_changes_status',
                    columnNames: ['status'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'play_history',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'bigint',
                },
                {
                    name: 'bet',
                    type: 'double precision',
                },
                {
                    name: 'won',
                    type: 'double precision',
                },
                {
                    name: 'lost',
                    type: 'double precision',
                },
                {
                    name: 'game_name',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_play_history_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_play_history_game_name',
                    columnNames: ['game_name'],
                },
                {
                    name: 'IDX_play_history_created_at',
                    columnNames: ['created_at'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'in_app_purchases',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'bigint',
                },
                {
                    name: 'platform',
                    type: 'text',
                },
                {
                    name: 'product_id',
                    type: 'text',
                },
                {
                    name: 'transaction_id',
                    type: 'text',
                    isUnique: true,
                },
                {
                    name: 'amount',
                    type: 'double precision',
                },
                {
                    name: 'currency',
                    type: 'text',
                    default: "'USD'",
                },
                {
                    name: 'purchased_at',
                    type: 'timestamp with time zone',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_in_app_purchases_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_in_app_purchases_transaction_id',
                    columnNames: ['transaction_id'],
                },
                {
                    name: 'IDX_in_app_purchases_platform',
                    columnNames: ['platform'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'vouchers',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'cost',
                    type: 'double precision',
                },
                {
                    name: 'provider',
                    type: 'varchar',
                },
                {
                    name: 'img_url',
                    type: 'varchar',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_vouchers_provider',
                    columnNames: ['provider'],
                },
                {
                    name: 'IDX_vouchers_cost',
                    columnNames: ['cost'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users_vouchers',
            columns: [
                {
                    name: 'id',
                    type: 'bigserial',
                    isPrimary: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'bigint',
                },
                {
                    name: 'voucher_id',
                    type: 'bigint',
                },
                {
                    name: 'created_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_users_vouchers_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_users_vouchers_voucher_id',
                    columnNames: ['voucher_id'],
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'password_reset_tokens',
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
                    type: 'text',
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
                    default: 'NOW()',
                },
            ],
            indices: [
                {
                    name: 'IDX_password_reset_tokens_token',
                    columnNames: ['token'],
                },
                {
                    name: 'IDX_password_reset_tokens_user_id',
                    columnNames: ['user_id'],
                },
                {
                    name: 'IDX_password_reset_tokens_expires_at',
                    columnNames: ['expires_at'],
                },
            ],
        }), true);
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createForeignKey('devices', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('coins_balance_changes', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('play_history', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('in_app_purchases', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('users_vouchers', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('users_vouchers', new typeorm_1.TableForeignKey({
            columnNames: ['voucher_id'],
            referencedTableName: 'vouchers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('password_reset_tokens', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'players',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const tables = [
            'devices',
            'coins_balance_changes',
            'play_history',
            'in_app_purchases',
            'users_vouchers',
            'password_reset_tokens',
        ];
        for (const tableName of tables) {
            const table = await queryRunner.getTable(tableName);
            if (table) {
                const foreignKeys = table.foreignKeys;
                for (const fk of foreignKeys) {
                    await queryRunner.dropForeignKey(tableName, fk);
                }
            }
        }
        await queryRunner.dropTable('password_reset_tokens');
        await queryRunner.dropTable('users_vouchers');
        await queryRunner.dropTable('vouchers');
        await queryRunner.dropTable('in_app_purchases');
        await queryRunner.dropTable('play_history');
        await queryRunner.dropTable('coins_balance_changes');
        await queryRunner.dropTable('devices');
        await queryRunner.dropTable('admin_users');
        await queryRunner.dropTable('players');
    }
}
exports.InitialDatabaseSchema1725000000000 = InitialDatabaseSchema1725000000000;
//# sourceMappingURL=1725000000000-InitialDatabaseSchema.js.map