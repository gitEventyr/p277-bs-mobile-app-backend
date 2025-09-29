"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const admin_user_entity_1 = require("../entities/admin-user.entity");
const player_entity_1 = require("../entities/player.entity");
const device_entity_1 = require("../entities/device.entity");
const coins_balance_change_entity_1 = require("../entities/coins-balance-change.entity");
const play_history_entity_1 = require("../entities/play-history.entity");
const in_app_purchase_entity_1 = require("../entities/in-app-purchase.entity");
const voucher_entity_1 = require("../entities/voucher.entity");
const voucher_request_entity_1 = require("../entities/voucher-request.entity");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
const phone_verification_token_entity_1 = require("../entities/phone-verification-token.entity");
const email_verification_token_entity_1 = require("../entities/email-verification-token.entity");
const casino_entity_1 = require("../entities/casino.entity");
const casino_action_entity_1 = require("../entities/casino-action.entity");
const rp_balance_transaction_entity_1 = require("../entities/rp-balance-transaction.entity");
const bcryptjs = __importStar(require("bcryptjs"));
async function cleanupDatabase() {
    console.log('🧹 Starting database cleanup...');
    console.log('⚠️  This will remove ALL data from all tables while preserving structure.');
    console.log('');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        const entities = [
            voucher_request_entity_1.VoucherRequest,
            voucher_entity_1.Voucher,
            in_app_purchase_entity_1.InAppPurchase,
            play_history_entity_1.PlayHistory,
            coins_balance_change_entity_1.CoinsBalanceChange,
            rp_balance_transaction_entity_1.RpBalanceTransaction,
            casino_action_entity_1.CasinoAction,
            device_entity_1.Device,
            player_entity_1.Player,
            password_reset_token_entity_1.PasswordResetToken,
            phone_verification_token_entity_1.PhoneVerificationToken,
            email_verification_token_entity_1.EmailVerificationToken,
            casino_entity_1.Casino,
            admin_user_entity_1.AdminUser,
        ];
        console.log('🗑️  Truncating tables...');
        await dataSource.query('SET session_replication_role = replica;');
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity);
            const tableName = repository.metadata.tableName;
            try {
                await dataSource.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
                console.log(`   ✅ Cleared ${tableName}`);
            }
            catch (error) {
                console.log(`   ⚠️  Warning: Could not truncate ${tableName} - ${error.message}`);
            }
        }
        await dataSource.query('SET session_replication_role = DEFAULT;');
        console.log('');
        console.log('✨ Database cleanup completed!');
        console.log('');
        console.log('🌱 Re-seeding admin users...');
        await seedAdminUsers(dataSource);
    }
    catch (error) {
        console.error('❌ Database cleanup failed:', error);
        throw error;
    }
    finally {
        await app.close();
    }
}
async function seedAdminUsers(dataSource) {
    const adminRepository = dataSource.getRepository(admin_user_entity_1.AdminUser);
    const admins = [
        {
            email: 'admin@casino.com',
            password: 'admin123',
            display_name: 'Casino Admin',
        },
        {
            email: 'test@admin.com',
            password: 'test123',
            display_name: 'Test Admin',
        },
    ];
    for (const adminData of admins) {
        try {
            const passwordHash = await bcryptjs.hash(adminData.password, 10);
            const admin = adminRepository.create({
                email: adminData.email,
                password_hash: passwordHash,
                display_name: adminData.display_name,
                is_active: true,
            });
            await adminRepository.save(admin);
            console.log(`   ✅ Created admin: ${adminData.email} (password: ${adminData.password})`);
        }
        catch (error) {
            console.error(`   ❌ Error creating admin ${adminData.email}:`, error);
        }
    }
    console.log('');
    console.log('🎉 Database cleanup and seeding completed!');
    console.log('');
    console.log('📋 Available login credentials:');
    console.log('   • admin@casino.com / admin123');
    console.log('   • test@admin.com / test123');
    console.log('');
    console.log('🌐 Access admin dashboard: http://localhost:3000/admin/login');
}
cleanupDatabase()
    .then(() => {
    console.log('✅ Process completed successfully!');
    process.exit(0);
})
    .catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
});
//# sourceMappingURL=cleanup-database.js.map