import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { CreateWorkExperienceDto } from './create-work-experience.dto';
import { CreateEducationDto } from './create-education.dto';

export class CreateCandidateDto {
  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ description: 'Professional summary', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Skills', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    description: 'Work experience',
    required: false,
  })
  @IsOptional()
  @IsArray()
  workExperience?: CreateWorkExperienceDto[];

  @ApiProperty({
    description: 'Education history',
    required: false,
  })
  @IsOptional()
  @IsArray()
  educationHistory?: CreateEducationDto[];
}
