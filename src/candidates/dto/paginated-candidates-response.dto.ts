import { CandidateResponseDto } from './candidate-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

export class PaginatedCandidatesResponseDto extends PaginatedResponseDto<CandidateResponseDto> {}
