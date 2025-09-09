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
const bcryptjs = __importStar(require("bcryptjs"));
const admin_user_entity_1 = require("../entities/admin-user.entity");
const typeorm_1 = require("@nestjs/typeorm");
async function seedAdmins() {
    console.log('🌱 Starting admin user seeding...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const adminRepository = app.get((0, typeorm_1.getRepositoryToken)(admin_user_entity_1.AdminUser));
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
            const existingAdmin = await adminRepository.findOne({
                where: { email: adminData.email },
            });
            if (existingAdmin) {
                console.log(`⚠️  Admin ${adminData.email} already exists, skipping...`);
                continue;
            }
            const passwordHash = await bcryptjs.hash(adminData.password, 10);
            const admin = adminRepository.create({
                email: adminData.email,
                password_hash: passwordHash,
                display_name: adminData.display_name,
                is_active: true,
            });
            await adminRepository.save(admin);
            console.log(`✅ Created admin: ${adminData.email} (password: ${adminData.password})`);
        }
        catch (error) {
            console.error(`❌ Error creating admin ${adminData.email}:`, error);
        }
    }
    await app.close();
    console.log('🎉 Admin seeding completed!');
    console.log('');
    console.log('Login credentials:');
    console.log('- admin@casino.com / admin123');
    console.log('- test@admin.com / test123');
    console.log('');
    console.log('Access the admin dashboard at: http://localhost:3000/admin/login');
}
seedAdmins()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-admin.js.map