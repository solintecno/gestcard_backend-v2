import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCandidateRatingsTable1736058000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear la tabla candidate_ratings
    await queryRunner.createTable(
      new Table({
        name: 'candidate_ratings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'rating_category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'context_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'context_reference',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'candidate_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'rated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'IDX_CANDIDATE_RATINGS_CANDIDATE_ID',
            columnNames: ['candidate_id'],
          },
          {
            name: 'IDX_CANDIDATE_RATINGS_RATED_BY',
            columnNames: ['rated_by'],
          },
          {
            name: 'IDX_CANDIDATE_RATINGS_CATEGORY',
            columnNames: ['rating_category'],
          },
          {
            name: 'IDX_CANDIDATE_RATINGS_CONTEXT',
            columnNames: ['context_type', 'context_reference'],
          },
        ],
      }),
      true,
    );

    // Crear la clave foránea hacia candidates
    await queryRunner.createForeignKey(
      'candidate_ratings',
      new TableForeignKey({
        columnNames: ['candidate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'candidates',
        onDelete: 'CASCADE',
      }),
    );

    // Crear la clave foránea hacia users (rated_by)
    await queryRunner.createForeignKey(
      'candidate_ratings',
      new TableForeignKey({
        columnNames: ['rated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar claves foráneas
    const table = await queryRunner.getTable('candidate_ratings');

    if (table) {
      const candidateForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('candidate_id') !== -1,
      );
      if (candidateForeignKey) {
        await queryRunner.dropForeignKey(
          'candidate_ratings',
          candidateForeignKey,
        );
      }

      const userForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('rated_by') !== -1,
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey('candidate_ratings', userForeignKey);
      }
    }

    // Eliminar la tabla
    await queryRunner.dropTable('candidate_ratings');
  }
}
