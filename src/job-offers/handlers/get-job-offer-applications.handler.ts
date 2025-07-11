import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../entities/job-application.entity';
import { GetJobOfferApplicationsQuery } from '../queries/get-job-offer-applications.query';
import { PaginatedJobApplicationsResponseDto } from '../dto/paginated-job-applications-response.dto';
import { JobApplicationResponseDto } from '../dto/job-application-response.dto';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetJobOfferApplicationsQuery)
export class GetJobOfferApplicationsHandler
  implements IQueryHandler<GetJobOfferApplicationsQuery>
{
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async execute(
    query: GetJobOfferApplicationsQuery,
  ): Promise<PaginatedJobApplicationsResponseDto> {
    const { jobOfferId, page, limit } = query;
    const [applications, total] =
      await this.jobApplicationRepository.findAndCount({
        where: { jobOfferId },
        relations: ['candidate'],
        order: { appliedAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    const data = applications.map((app) =>
      plainToInstance(JobApplicationResponseDto, {
        ...app,
        candidate: app.candidate,
      }),
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
