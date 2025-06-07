import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFavorites060620251405 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.createTable(
      new Table({
        name: 'favs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'artists',
            type: 'uuid',
            isArray: true,
            isNullable: false,
            default: "'{}'",
          },
          {
            name: 'albums',
            type: 'uuid',
            isArray: true,
            isNullable: false,
            default: "'{}'",
          },
          {
            name: 'tracks',
            type: 'uuid',
            isArray: true,
            isNullable: false,
            default: "'{}'",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favs');
  }
}
