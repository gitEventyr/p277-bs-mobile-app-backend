import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class EnsureCasinoActionsVisitorIdFK1756908000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
