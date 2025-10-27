import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class RemoveEmailUniqueConstraint1756905000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
