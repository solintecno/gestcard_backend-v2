import { ApiProperty } from '@nestjs/swagger';
import { JobOfferResponseDto } from './job-offer-response.dto';

export class PaginatedJobOffersResponseDto {
  @ApiProperty({
    description: 'Lista de ofertas de trabajo',
    type: [JobOfferResponseDto],
  })
  data: JobOfferResponseDto[];

  @ApiProperty({ description: 'Información de paginación' })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
