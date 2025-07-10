import { ApiProperty } from '@nestjs/swagger';
import { WorkExperienceResponseDto } from './work-experience-response.dto';
import { EducationResponseDto } from './education-response.dto';

export class CandidateResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Full name', required: false })
  name?: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @ApiProperty({ description: 'Address', required: false })
  address?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Professional summary', required: false })
  summary?: string;

  @ApiProperty({ description: 'Skills', required: false, type: [String] })
  skills?: string[];

  @ApiProperty({
    description: 'Average rating of the candidate',
    required: false,
    example: 4.5,
  })
  rating?: number | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Email address', required: false })
  email?: string;

  @ApiProperty({
    description: 'Work experience',
    required: false,
    type: [WorkExperienceResponseDto],
  })
  workExperience?: WorkExperienceResponseDto[];

  @ApiProperty({
    description: 'Education history',
    required: false,
    type: [EducationResponseDto],
  })
  educationHistory?: EducationResponseDto[];
}
