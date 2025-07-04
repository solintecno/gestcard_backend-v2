import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobApplicationDto {
  @ApiProperty({
    description: 'ID del candidato que aplica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  candidateId: string;

  @ApiProperty({
    description: 'ID de la oferta de trabajo',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  jobOfferId: string;

  @ApiPropertyOptional({
    description: 'Carta de presentación',
    example: 'Me interesa mucho esta posición porque...',
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Disponible para entrevista inmediata',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
