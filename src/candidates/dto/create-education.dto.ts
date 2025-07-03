import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ description: 'Institution name' })
  @IsString()
  institution: string;

  @ApiProperty({ description: 'Degree obtained' })
  @IsString()
  degree: string;

  @ApiProperty({ description: 'Field of study' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'GPA or grade', required: false })
  @IsOptional()
  @IsString()
  gpa?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Candidate ID' })
  @IsUUID()
  candidateId: string;
}
