import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobOfferResponseDto {
  @ApiProperty({ description: 'ID de la oferta' })
  id: string;

  @ApiProperty({ description: 'Título de la oferta' })
  title: string;

  @ApiProperty({ description: 'Descripción de la oferta' })
  description: string;

  @ApiProperty({ description: 'Empresa' })
  company: string;

  @ApiProperty({ description: 'Ubicación' })
  location: string;

  @ApiPropertyOptional({ description: 'Salario' })
  salary?: number;

  @ApiProperty({ description: 'Tipo de empleo' })
  employmentType: string;

  @ApiProperty({ description: 'Estado' })
  status: string;

  @ApiProperty({ description: 'Requisitos', type: [String] })
  requirements: string[];

  @ApiProperty({ description: 'Beneficios', type: [String] })
  benefits: string[];

  @ApiPropertyOptional({ description: 'Nivel de experiencia' })
  experienceLevel?: string;

  @ApiPropertyOptional({ description: 'Fecha límite de aplicación' })
  applicationDeadline?: Date;

  @ApiProperty({ description: 'ID del creador' })
  createdBy: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;
}
