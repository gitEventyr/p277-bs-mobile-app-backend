import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddEmailVerificationTokens1756904000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
