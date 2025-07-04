import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  Min,
} from 'class-validator';
import { EmploymentType, JobOfferStatus } from '../../shared/enums';

export class CreateJobOfferDto {
  @ApiProperty({ description: 'Título de la oferta de trabajo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descripción detallada de la oferta' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ description: 'Ubicación del trabajo' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ description: 'Salario ofrecido' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({
    description: 'Tipo de empleo',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({
    description: 'Estado de la oferta',
    enum: JobOfferStatus,
    default: JobOfferStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(JobOfferStatus)
  status?: JobOfferStatus;

  @ApiPropertyOptional({
    description: 'Lista de requisitos',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiPropertyOptional({
    description: 'Lista de beneficios',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({ description: 'Nivel de experiencia requerido' })
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @ApiPropertyOptional({ description: 'Fecha límite para aplicar' })
  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @ApiPropertyOptional({
    description: 'IDs de las habilidades requeridas',
    type: [String],
    example: ['skill-uuid-1', 'skill-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];
}
