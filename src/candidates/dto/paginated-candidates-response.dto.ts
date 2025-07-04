import { ApiProperty } from '@nestjs/swagger';
import { CandidateResponseDto } from './candidate-response.dto';

export class PaginatedCandidatesResponseDto {
  @ApiProperty({
    description: 'List of candidates',
    type: [CandidateResponseDto],
  })
  data: CandidateResponseDto[];

  @ApiProperty({ description: 'Total number of candidates' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
