import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../shared/enums';
import { EducationResponseDto } from './education-response.dto';
import { WorkExperienceResponseDto } from './work-experience-response.dto';

export class CandidateResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'First name' })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Address', required: false })
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  postalCode?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Current position', required: false })
  currentPosition?: string;

  @ApiProperty({ description: 'Professional summary', required: false })
  summary?: string;

  @ApiProperty({ description: 'Skills', required: false })
  skills?: string[];

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

  @ApiProperty({ description: 'Resume URL', required: false })
  resumeUrl?: string;

  @ApiProperty({ description: 'LinkedIn URL', required: false })
  linkedinUrl?: string;

  @ApiProperty({ description: 'GitHub URL', required: false })
  githubUrl?: string;

  @ApiProperty({ description: 'Portfolio URL', required: false })
  portfolioUrl?: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
