import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetCandidatesQueryDto {
  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by position', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Filter by city', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Filter by status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Include skills in response',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  skills?: boolean;

  @ApiProperty({
    description: 'Include work experience in response',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  workExperience?: boolean;

  @ApiProperty({
    description: 'Include education history in response',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  education?: boolean;

  @ApiProperty({
    description: 'Nombres de skills para filtrar (separados por coma)',
    required: false,
    type: String,
    example: 'JavaScript,Java,Python',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return [];
    }
    return value
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill !== '');
  })
  skillsFilter?: string[];
}
