import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as readline from 'readline';
import { Player } from '../entities/player.entity';

// Prompt for email input
function promptForEmail(): Promise<string> {
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

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function verifyUser() {
  console.log('='.repeat(60));
  console.log('User Verification Script (QA Testing)');
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

    const playerRepository = dataSource.getRepository(Player);

    // Find user by email
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

    // Check current verification status
    console.log('📋 Current verification status:');
    console.log(
      `   Email verified: ${user.email_verified ? '✅ Yes' : '❌ No'}`,
    );
    console.log(
      `   Phone verified: ${user.phone_verified ? '✅ Yes' : '❌ No'}`,
    );
    console.log();

    // Update verification status
    console.log('🔄 Updating verification status...');
    const verifiedAt = new Date();

    await playerRepository.update(
      { id: user.id },
      {
        email_verified: true,
        email_verified_at: verifiedAt,
        phone_verified: true,
        phone_verified_at: verifiedAt,
      },
    );

    console.log('✅ User verification status updated');
    console.log();

    // Display updated status
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
  } catch (error) {
    console.error();
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the script
verifyUser()
  .then(() => {
    console.log('✅ Process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
