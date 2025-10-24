import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { AdminUser } from '../entities/admin-user.entity';
import { Player } from '../entities/player.entity';
import { Device } from '../entities/device.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { PlayHistory } from '../entities/play-history.entity';
import { InAppPurchase } from '../entities/in-app-purchase.entity';
import { Voucher } from '../entities/voucher.entity';
import { VoucherRequest } from '../entities/voucher-request.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { PhoneVerificationToken } from '../entities/phone-verification-token.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { Casino } from '../entities/casino.entity';
import { CasinoAction } from '../entities/casino-action.entity';
import { RpBalanceTransaction } from '../entities/rp-balance-transaction.entity';
import * as bcryptjs from 'bcryptjs';

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...');
  console.log(
    '⚠️  This will remove ALL data from all tables while preserving structure.',
  );
  console.log('');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Get all entity metadata
    const entities = [
      // Order matters for foreign key constraints - delete in reverse dependency order
      VoucherRequest,
      Voucher,
      InAppPurchase,
      PlayHistory,
      CoinsBalanceChange,
      RpBalanceTransaction,
      CasinoAction,
      Device,
      Player,
      PasswordResetToken,
      PhoneVerificationToken,
      EmailVerificationToken,
      Casino,
      AdminUser,
    ];

    console.log('🗑️  Truncating tables...');

    // Disable foreign key checks temporarily
    await dataSource.query('SET session_replication_role = replica;');

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity);
      const tableName = repository.metadata.tableName;

      try {
        await dataSource.query(
          `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
        );
        console.log(`   ✅ Cleared ${tableName}`);
      } catch (error) {
        console.log(
          `   ⚠️  Warning: Could not truncate ${tableName} - ${error.message}`,
        );
      }
    }

    // Re-enable foreign key checks
    await dataSource.query('SET session_replication_role = DEFAULT;');

    console.log('');
    console.log('✨ Database cleanup completed!');
    console.log('');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Execute the cleanup
cleanupDatabase()
  .then(() => {
    console.log('✅ Process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Process failed:', error);
    process.exit(1);
  });
