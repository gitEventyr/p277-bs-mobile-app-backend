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
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const readline = __importStar(require("readline"));
const admin_user_entity_1 = require("../entities/admin-user.entity");
function generateStrongPassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = lowercase + uppercase + numbers + special;
    let password = '';
    password += lowercase[crypto.randomInt(lowercase.length)];
    password += uppercase[crypto.randomInt(uppercase.length)];
    password += numbers[crypto.randomInt(numbers.length)];
    password += special[crypto.randomInt(special.length)];
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(allChars.length)];
    }
    return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
}
function promptForEmail() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('Enter the email for the new admin: ', (email) => {
            rl.close();
            resolve(email.trim());
        });
    });
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function resetAdmin() {
    console.log('='.repeat(60));
    console.log('Admin Reset Script');
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
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'casino_db',
        entities: [admin_user_entity_1.AdminUser],
        synchronize: false,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        console.log();
        const adminRepository = dataSource.getRepository(admin_user_entity_1.AdminUser);
        console.log('🗑️  Removing all existing admins...');
        const existingAdmins = await adminRepository.find();
        console.log(`   Found ${existingAdmins.length} existing admin(s)`);
        if (existingAdmins.length > 0) {
            await adminRepository.remove(existingAdmins);
            console.log('✅ All existing admins removed');
        }
        else {
            console.log('   No existing admins to remove');
        }
        console.log();
        console.log('🔐 Generating strong password...');
        const password = generateStrongPassword(16);
        const passwordHash = await bcrypt.hash(password, 10);
        console.log('✅ Password generated');
        console.log();
        console.log('👤 Creating new admin...');
        const newAdmin = adminRepository.create({
            email: email,
            password_hash: passwordHash,
            display_name: email.split('@')[0],
            is_active: true,
        });
        await adminRepository.save(newAdmin);
        console.log('✅ New admin created successfully');
        console.log();
        console.log('='.repeat(60));
        console.log('NEW ADMIN CREDENTIALS');
        console.log('='.repeat(60));
        console.log();
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log();
        console.log('⚠️  IMPORTANT: Save these credentials securely!');
        console.log('   This password will not be shown again.');
        console.log('='.repeat(60));
        console.log();
        await dataSource.destroy();
        console.log('✅ Script completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error();
        console.error('❌ Error:', error.message);
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
        process.exit(1);
    }
}
resetAdmin().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=reset-admin.js.map