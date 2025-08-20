import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/services/admin.service';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { AdminUser } from '../entities/admin-user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seedAdmins() {
  console.log('🌱 Starting admin user seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const adminRepository = app.get<Repository<AdminUser>>(
    getRepositoryToken(AdminUser),
  );

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
      // Check if admin already exists
      const existingAdmin = await adminRepository.findOne({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`⚠️  Admin ${adminData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const passwordHash = await bcryptjs.hash(adminData.password, 10);

      // Create new admin
      const admin = adminRepository.create({
        email: adminData.email,
        password_hash: passwordHash,
        display_name: adminData.display_name,
        is_active: true,
      });

      await adminRepository.save(admin);
      console.log(
        `✅ Created admin: ${adminData.email} (password: ${adminData.password})`,
      );
    } catch (error) {
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
  console.log(
    'Access the admin dashboard at: http://localhost:3000/admin/login',
  );
}

seedAdmins()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
