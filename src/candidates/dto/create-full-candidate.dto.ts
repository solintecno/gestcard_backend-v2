import { ApiProperty } from '@nestjs/swagger';
import { CreateEducationDto } from './create-education.dto';
import { CreateWorkExperienceDto } from './create-work-experience.dto';
import { IsOptional } from 'class-validator';

export class CreateFullCandidateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  location?: string;

  @ApiProperty({ type: [CreateEducationDto], required: false })
  @IsOptional()
  education?: CreateEducationDto[];

  @ApiProperty({ type: [CreateWorkExperienceDto], required: false })
  @IsOptional()
  workExperience?: CreateWorkExperienceDto[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'IDs de las skills del candidato',
  })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  summary?: string;
}
