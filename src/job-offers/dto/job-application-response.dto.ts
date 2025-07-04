import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateResponseDto } from '../../candidates/dto/candidate-response.dto';
import { JobOfferResponseDto } from './job-offer-response.dto';

export class JobApplicationResponseDto {
  @ApiProperty({
    description: 'ID único de la aplicación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del candidato',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  candidateId: string;

  @ApiProperty({
    description: 'ID de la oferta de trabajo',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  jobOfferId: string;

  @ApiProperty({
    description: 'Estado de la aplicación',
    enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
    example: 'PENDING',
  })
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

  @ApiPropertyOptional({
    description: 'Carta de presentación',
    example: 'Me interesa mucho esta posición porque...',
  })
  coverLetter?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Candidato muy interesante',
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de aplicación',
    example: '2024-01-15T10:30:00Z',
  })
  appliedAt: Date;

  @ApiPropertyOptional({
    description: 'Fecha de revisión',
    example: '2024-01-16T14:20:00Z',
  })
  reviewedAt?: Date;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-16T14:20:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Información del candidato',
    type: CandidateResponseDto,
  })
  candidate?: CandidateResponseDto;

  @ApiPropertyOptional({
    description: 'Información de la oferta de trabajo',
    type: JobOfferResponseDto,
  })
  jobOffer?: JobOfferResponseDto;
}
