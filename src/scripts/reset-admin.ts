import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as readline from 'readline';
import { AdminUser } from '../entities/admin-user.entity';

// Generate a strong random password
function generateStrongPassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = lowercase + uppercase + numbers + special;

  let password = '';

  // Ensure at least one character from each category
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += special[crypto.randomInt(special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => crypto.randomInt(3) - 1)
    .join('');
}

// Prompt for email input
function promptForEmail(): Promise<string> {
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

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function resetAdmin() {
  console.log('='.repeat(60));
  console.log('Admin Reset Script');
  console.log('='.repeat(60));
  console.log();

  // Get email from user
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

  // Use NestJS application context to get configured DataSource
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('✅ Database connected');
    console.log();

    const adminRepository = dataSource.getRepository(AdminUser);

    // Remove all existing admins
    console.log('🗑️  Removing all existing admins...');
    const existingAdmins = await adminRepository.find();
    console.log(`   Found ${existingAdmins.length} existing admin(s)`);

    if (existingAdmins.length > 0) {
      await adminRepository.remove(existingAdmins);
      console.log('✅ All existing admins removed');
    } else {
      console.log('   No existing admins to remove');
    }
    console.log();

    // Generate strong password
    console.log('🔐 Generating strong password...');
    const password = generateStrongPassword(16);
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✅ Password generated');
    console.log();

    // Create new admin
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

    // Display credentials
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

    console.log('✅ Script completed successfully');
  } catch (error) {
    console.error();
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the script
resetAdmin()
  .then(() => {
    console.log('✅ Process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
