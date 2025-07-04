import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { GetJobOffersQuery } from '../queries';
import { JobOffer } from '../entities';
import { PaginatedJobOffersResponseDto } from '../dto';

@QueryHandler(GetJobOffersQuery)
export class GetJobOffersHandler implements IQueryHandler<GetJobOffersQuery> {
  private readonly logger = new Logger(GetJobOffersHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async execute(
    query: GetJobOffersQuery,
  ): Promise<PaginatedJobOffersResponseDto> {
    this.logger.log(
      `Getting job offers - Page: ${query.page}, Limit: ${query.limit}`,
    );

    const queryBuilder = this.jobOfferRepository
      .createQueryBuilder('jobOffer')
      .leftJoinAndSelect('jobOffer.creator', 'creator')
      .leftJoinAndSelect('jobOffer.skills', 'skills');

    // Apply filters
    if (query.search) {
      queryBuilder.andWhere(
        '(jobOffer.title ILIKE :search OR jobOffer.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.location) {
      queryBuilder.andWhere('jobOffer.location ILIKE :location', {
        location: `%${query.location}%`,
      });
    }

    if (query.company) {
      queryBuilder.andWhere('jobOffer.company ILIKE :company', {
        company: `%${query.company}%`,
      });
    }

    if (query.employmentType) {
      queryBuilder.andWhere('jobOffer.employmentType = :employmentType', {
        employmentType: query.employmentType,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('jobOffer.status = :status', {
        status: query.status,
      });
    }

    if (query.minSalary !== undefined) {
      queryBuilder.andWhere('jobOffer.salary >= :minSalary', {
        minSalary: query.minSalary,
      });
    }

    if (query.maxSalary !== undefined) {
      queryBuilder.andWhere('jobOffer.salary <= :maxSalary', {
        maxSalary: query.maxSalary,
      });
    }

    // Apply pagination
    const offset = (query.page - 1) * query.limit;
    queryBuilder.skip(offset).take(query.limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('jobOffer.createdAt', 'DESC');

    const [jobOffers, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: jobOffers,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }
}
