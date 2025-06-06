import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers060620251302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'login',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'integer',
            isNullable: false,
            default: 1,
          },
          {
            name: 'createdAt',
            type: 'bigint',
            isNullable: false,
            default: 'EXTRACT(EPOCH FROM NOW())::bigint',
          },
          {
            name: 'updatedAt',
            type: 'bigint',
            isNullable: false,
            default: 'EXTRACT(EPOCH FROM NOW())::bigint',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
