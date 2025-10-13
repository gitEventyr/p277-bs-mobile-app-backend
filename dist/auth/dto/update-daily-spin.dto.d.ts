export declare class UpdateDailySpinDto {
    daily_spin_wheel_day_count: number;
    daily_spin_wheel_last_spin?: string;
}
export declare class UpdateDailySpinResponseDto {
    message: string;
    daily_spin_wheel_day_count: number;
    daily_spin_wheel_last_spin: Date;
}
