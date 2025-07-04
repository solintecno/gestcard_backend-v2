import { ApiProperty } from '@nestjs/swagger';

export class CandidateRatingResponseDto {
  @ApiProperty({
    description: 'Rating ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Rating value from 1.00 to 5.00',
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: 'Optional comment about the rating',
    required: false,
    example: 'Excellent technical skills and communication',
  })
  comment?: string;

  @ApiProperty({
    description: 'Category of the rating',
    required: false,
    example: 'technical_skills',
  })
  ratingCategory?: string;

  @ApiProperty({
    description: 'Context type where the rating was given',
    required: false,
    example: 'interview',
  })
  contextType?: string;

  @ApiProperty({
    description: 'Reference to the context',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  contextReference?: string;

  @ApiProperty({
    description: 'ID of the candidate being rated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  candidateId: string;

  @ApiProperty({
    description: 'ID of the user who gave the rating',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ratedById?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T10:00:00.000Z',
  })
  updatedAt: Date;
}
