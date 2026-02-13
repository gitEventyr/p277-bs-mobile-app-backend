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
const readline = __importStar(require("readline"));
const player_entity_1 = require("../entities/player.entity");
function promptForEmail() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('Enter the user email to verify: ', (email) => {
            rl.close();
            resolve(email.trim());
        });
    });
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function verifyUser() {
    console.log('='.repeat(60));
    console.log('User Verification Script (QA Testing)');
    console.log('='.repeat(60));
    console.log();
    const email = await promptForEmail();
    if (!email) {
        console.error('❌ Error: Email is required');
        process.exit(1);
    }
    if (!isValidEmail(email)) {
        console.error('❌ Error: Invalid email format');
        process.exit(1);
    }
    console.log();
    console.log('⚙️  Connecting to database...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        console.log('✅ Database connected');
        console.log();
        const playerRepository = dataSource.getRepository(player_entity_1.Player);
        console.log(`🔍 Looking for user with email: ${email}`);
        const user = await playerRepository.findOne({
            where: { email: email, is_deleted: false },
        });
        if (!user) {
            console.error('❌ Error: User not found with that email address');
            process.exit(1);
        }
        console.log('✅ User found');
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name || '(not set)'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || '(not set)'}`);
        console.log();
        console.log('📋 Current verification status:');
        console.log(`   Email verified: ${user.email_verified ? '✅ Yes' : '❌ No'}`);
        console.log(`   Phone verified: ${user.phone_verified ? '✅ Yes' : '❌ No'}`);
        console.log();
        console.log('🔄 Updating verification status...');
        const verifiedAt = new Date();
        await playerRepository.update({ id: user.id }, {
            email_verified: true,
            email_verified_at: verifiedAt,
            phone_verified: true,
            phone_verified_at: verifiedAt,
        });
        console.log('✅ User verification status updated');
        console.log();
        console.log('='.repeat(60));
        console.log('UPDATED VERIFICATION STATUS');
        console.log('='.repeat(60));
        console.log();
        console.log(`User: ${user.email}`);
        console.log(`Email verified: ✅ Yes (${verifiedAt.toISOString()})`);
        console.log(`Phone verified: ✅ Yes (${verifiedAt.toISOString()})`);
        console.log();
        console.log('ℹ️  NOTE: This is a database-only change for QA testing.');
        console.log('   No emails or SMS messages were sent.');
        console.log('='.repeat(60));
        console.log();
        console.log('✅ Script completed successfully');
    }
    catch (error) {
        console.error();
        console.error('❌ Error:', error.message);
        throw error;
    }
    finally {
        await app.close();
    }
}
verifyUser()
    .then(() => {
    console.log('✅ Process completed successfully!');
    process.exit(0);
})
    .catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
});
//# sourceMappingURL=verify-user.js.map