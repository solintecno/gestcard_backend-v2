import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateJobApplicationDto {
  @ApiPropertyOptional({
    description: 'Estado de la aplicación',
    enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
    example: 'REVIEWED',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'])
  status?: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Candidato muy interesante, programar entrevista',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Fecha de revisión',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate()
  reviewedAt?: Date;
}
