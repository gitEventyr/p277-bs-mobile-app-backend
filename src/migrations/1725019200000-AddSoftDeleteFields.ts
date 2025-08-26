import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSoftDeleteFields1725019200000 implements MigrationInterface {
  name = 'AddSoftDeleteFields1725019200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add soft delete fields to players table
    await queryRunner.addColumns('players', [
      new TableColumn({
        name: 'is_deleted',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp with time zone',
        isNullable: true,
      }),
      new TableColumn({
        name: 'deletion_reason',
        type: 'text',
        isNullable: true,
      }),
    ]);

    // Add index for soft delete queries
    await queryRunner.query(
      `CREATE INDEX "IDX_players_is_deleted" ON "players" ("is_deleted")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX "IDX_players_is_deleted"`);

    // Remove soft delete fields
    await queryRunner.dropColumns('players', [
      'is_deleted',
      'deleted_at', 
      'deletion_reason'
    ]);
  }
}