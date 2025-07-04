import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateCandidateRatingDto {
  @ApiProperty({
    description: 'Rating value from 1.00 to 5.00',
    minimum: 1,
    maximum: 5,
    type: 'number',
    format: 'decimal',
    example: 4.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1.0)
  @Max(5.0)
  rating: number;

  @ApiProperty({
    description: 'Optional comment about the rating',
    required: false,
    example: 'Excellent technical skills and communication',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Category of the rating',
    required: false,
    example: 'technical_skills',
    enum: [
      'technical_skills',
      'communication',
      'teamwork',
      'problem_solving',
      'leadership',
      'overall',
    ],
  })
  @IsOptional()
  @IsString()
  ratingCategory?: string;

  @ApiProperty({
    description: 'Context type where the rating was given',
    required: false,
    example: 'interview',
    enum: ['interview', 'project', 'assessment', 'feedback', 'general'],
  })
  @IsOptional()
  @IsString()
  contextType?: string;

  @ApiProperty({
    description: 'Reference to the context (e.g., interview ID, project ID)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  contextReference?: string;

  @ApiProperty({
    description: 'ID of the candidate being rated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  candidateId: string;

  @ApiProperty({
    description: 'ID of the user giving the rating',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  ratedById?: string;
}
