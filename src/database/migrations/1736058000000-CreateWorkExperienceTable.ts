import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateWorkExperienceTable1736058000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear la tabla work_experience
    await queryRunner.createTable(
      new Table({
        name: 'work_experience',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'company',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'position',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'candidate_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Crear la clave foránea
    await queryRunner.createForeignKey(
      'work_experience',
      new TableForeignKey({
        columnNames: ['candidate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'candidates',
        onDelete: 'CASCADE',
      }),
    );

    // Eliminar la columna work_experience de la tabla candidates
    await queryRunner.dropColumn('candidates', 'work_experience');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Agregar de vuelta la columna work_experience a candidates
    await queryRunner.query(`
      ALTER TABLE candidates 
      ADD COLUMN work_experience jsonb
    `);

    // Eliminar la tabla work_experience
    await queryRunner.dropTable('work_experience');
  }
}
