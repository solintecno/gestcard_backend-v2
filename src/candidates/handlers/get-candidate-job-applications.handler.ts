import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateJobApplicationsQuery } from '../queries/get-candidate-job-applications.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../../job-offers/entities/job-application.entity';
import { PaginatedJobApplicationsResponseDto } from '../../job-offers/dto/paginated-job-applications-response.dto';
import { JobApplicationResponseDto } from '../../job-offers/dto/job-application-response.dto';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetCandidateJobApplicationsQuery)
export class GetCandidateJobApplicationsHandler
  implements IQueryHandler<GetCandidateJobApplicationsQuery>
{
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async execute(
    query: GetCandidateJobApplicationsQuery,
  ): Promise<PaginatedJobApplicationsResponseDto> {
    const { candidateId, page, limit } = query;
    const [applications, total] =
      await this.jobApplicationRepository.findAndCount({
        where: { candidateId },
        relations: ['jobOffer', 'jobOffer.skills'], // Incluye las skills de la oferta
        order: { appliedAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    const data = applications.map((app) =>
      plainToInstance(JobApplicationResponseDto, {
        ...app,
        jobOffer: app.jobOffer,
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
