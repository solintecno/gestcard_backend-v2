import { ApiProperty } from '@nestjs/swagger';

export class EducationResponseDto {
  @ApiProperty({ description: 'Education ID' })
  id: string;

  @ApiProperty({ description: 'Institution name' })
  institution: string;

  @ApiProperty({ description: 'Degree obtained' })
  degree: string;

  @ApiProperty({ description: 'Field of study' })
  field: string;

  @ApiProperty({ description: 'Start date' })
  startDate: Date;

  @ApiProperty({ description: 'End date', required: false })
  endDate?: Date;

  @ApiProperty({ description: 'GPA or grade', required: false })
  gpa?: string;

  @ApiProperty({ description: 'Location', required: false })
  location?: string;

  @ApiProperty({ description: 'Description', required: false })
  description?: string;

  @ApiProperty({ description: 'Candidate ID' })
  candidateId: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
