import { ApiProperty } from '@nestjs/swagger';

export class WorkExperienceResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  company: string;

  @ApiProperty({ description: 'Position/Job title' })
  position: string;

  @ApiProperty({ description: 'Start date' })
  startDate: string;

  @ApiProperty({ description: 'End date', required: false })
  endDate?: string;

  @ApiProperty({ description: 'Job description', required: false })
  description?: string;

  @ApiProperty({ description: 'Location', required: false })
  location?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
