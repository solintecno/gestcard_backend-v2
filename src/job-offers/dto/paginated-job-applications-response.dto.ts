import { ApiProperty } from '@nestjs/swagger';
import { JobApplicationResponseDto } from './job-application-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

export class PaginatedJobApplicationsResponseDto extends PaginatedResponseDto<JobApplicationResponseDto> {
  @ApiProperty({ type: [JobApplicationResponseDto] })
  declare data: JobApplicationResponseDto[];
}
