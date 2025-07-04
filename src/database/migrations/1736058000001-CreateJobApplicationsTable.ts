import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateJobApplicationsTable1736058000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'job_applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'candidate_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'job_offer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'application_status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          {
            name: 'cover_letter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'applied_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'reviewed_at',
            type: 'timestamp',
            isNullable: true,
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
        foreignKeys: [
          {
            columnNames: ['candidate_id'],
            referencedTableName: 'candidates',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['job_offer_id'],
            referencedTableName: 'job_offers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Crear índices para mejorar el rendimiento
    await queryRunner.createIndex(
      'job_applications',
      new TableIndex({
        name: 'IDX_job_applications_candidate_id',
        columnNames: ['candidate_id'],
      }),
    );

    await queryRunner.createIndex(
      'job_applications',
      new TableIndex({
        name: 'IDX_job_applications_job_offer_id',
        columnNames: ['job_offer_id'],
      }),
    );

    // Índice único para evitar aplicaciones duplicadas
    await queryRunner.createIndex(
      'job_applications',
      new TableIndex({
        name: 'IDX_job_applications_unique_candidate_job',
        columnNames: ['candidate_id', 'job_offer_id'],
        isUnique: true,
      }),
    );

    // Índice por estado de aplicación
    await queryRunner.createIndex(
      'job_applications',
      new TableIndex({
        name: 'IDX_job_applications_status',
        columnNames: ['application_status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_applications');
  }
}
