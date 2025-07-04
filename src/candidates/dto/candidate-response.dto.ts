import { ApiProperty } from '@nestjs/swagger';
import { EducationResponseDto } from './education-response.dto';
import { WorkExperienceResponseDto } from './work-experience-response.dto';

export class CandidateResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Address', required: false })
  address?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Professional summary', required: false })
  summary?: string;

  @ApiProperty({ description: 'Skills', required: false })
  skills?: string[];

  @ApiProperty({
    description: 'Average rating of the candidate',
    required: false,
    example: 4.5,
  })
  rating?: number | null;

  @ApiProperty({
    description: 'Work experience',
    required: false,
  })
  workExperience: WorkExperienceResponseDto[];

  @ApiProperty({
    description: 'Education history',
    type: [EducationResponseDto],
  })
  educationHistory: EducationResponseDto[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
