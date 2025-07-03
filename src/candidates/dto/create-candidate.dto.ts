import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsUrl,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../shared/enums';

export class CreateCandidateDto {
  @ApiProperty({ description: 'Email address of the candidate' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'First name of the candidate' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Last name of the candidate' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  // Datos de residencia
  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  // Información profesional
  @ApiProperty({ description: 'Current position', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentPosition?: string;

  @ApiProperty({ description: 'Professional summary', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @ApiProperty({
    description: 'List of skills',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    description: 'Work experience',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        company: { type: 'string' },
        position: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
      },
    },
  })
  @IsOptional()
  @IsArray()
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
  }>;

  @ApiProperty({ description: 'Resume URL', required: false })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @ApiProperty({ description: 'LinkedIn profile URL', required: false })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiProperty({ description: 'GitHub profile URL', required: false })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiProperty({ description: 'Portfolio URL', required: false })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @ApiProperty({
    description: 'Candidate status',
    required: false,
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
