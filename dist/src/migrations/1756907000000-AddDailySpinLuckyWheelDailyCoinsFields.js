"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDailySpinLuckyWheelDailyCoinsFields1756907000000 = void 0;
class AddDailySpinLuckyWheelDailyCoinsFields1756907000000 {
    async up(queryRunner) {
        const hasDailySpinWheelDayCount = await queryRunner.hasColumn('players', 'daily_spin_wheel_day_count');
        const hasDailySpinWheelLastSpin = await queryRunner.hasColumn('players', 'daily_spin_wheel_last_spin');
        const hasLuckyWheelCount = await queryRunner.hasColumn('players', 'lucky_wheel_count');
        const hasDailyCoinsDaysCount = await queryRunner.hasColumn('players', 'daily_coins_days_count');
        const hasDailyCoinsLastReward = await queryRunner.hasColumn('players', 'daily_coins_last_reward');
        const columnsToAdd = [];
        if (!hasDailySpinWheelDayCount)
            columnsToAdd.push('ADD COLUMN "daily_spin_wheel_day_count" integer NOT NULL DEFAULT 0');
        if (!hasDailySpinWheelLastSpin)
            columnsToAdd.push('ADD COLUMN "daily_spin_wheel_last_spin" timestamp with time zone');
        if (!hasLuckyWheelCount)
            columnsToAdd.push('ADD COLUMN "lucky_wheel_count" integer NOT NULL DEFAULT 0');
        if (!hasDailyCoinsDaysCount)
            columnsToAdd.push('ADD COLUMN "daily_coins_days_count" integer NOT NULL DEFAULT 0');
        if (!hasDailyCoinsLastReward)
            columnsToAdd.push('ADD COLUMN "daily_coins_last_reward" timestamp with time zone');
        if (columnsToAdd.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players"
                ${columnsToAdd.join(',\n                ')}
            `);
        }
    }
    async down(queryRunner) {
        const hasDailySpinWheelDayCount = await queryRunner.hasColumn('players', 'daily_spin_wheel_day_count');
        const hasDailySpinWheelLastSpin = await queryRunner.hasColumn('players', 'daily_spin_wheel_last_spin');
        const hasLuckyWheelCount = await queryRunner.hasColumn('players', 'lucky_wheel_count');
        const hasDailyCoinsDaysCount = await queryRunner.hasColumn('players', 'daily_coins_days_count');
        const hasDailyCoinsLastReward = await queryRunner.hasColumn('players', 'daily_coins_last_reward');
        const columnsToDrop = [];
        if (hasDailyCoinsLastReward)
            columnsToDrop.push('DROP COLUMN "daily_coins_last_reward"');
        if (hasDailyCoinsDaysCount)
            columnsToDrop.push('DROP COLUMN "daily_coins_days_count"');
        if (hasLuckyWheelCount)
            columnsToDrop.push('DROP COLUMN "lucky_wheel_count"');
        if (hasDailySpinWheelLastSpin)
            columnsToDrop.push('DROP COLUMN "daily_spin_wheel_last_spin"');
        if (hasDailySpinWheelDayCount)
            columnsToDrop.push('DROP COLUMN "daily_spin_wheel_day_count"');
        if (columnsToDrop.length > 0) {
            await queryRunner.query(`
                ALTER TABLE "players"
                ${columnsToDrop.join(',\n                ')}
            `);
        }
    }
}
exports.AddDailySpinLuckyWheelDailyCoinsFields1756907000000 = AddDailySpinLuckyWheelDailyCoinsFields1756907000000;
//# sourceMappingURL=1756907000000-AddDailySpinLuckyWheelDailyCoinsFields.js.map