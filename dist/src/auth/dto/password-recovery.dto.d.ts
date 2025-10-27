export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}
export declare class PasswordRecoveryResponseDto {
    message: string;
}
export declare class ResetPasswordResponseDto {
    message: string;
}
