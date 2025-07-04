import { JobOfferResponseDto } from './job-offer-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

export class PaginatedJobOffersResponseDto extends PaginatedResponseDto<JobOfferResponseDto> {}
