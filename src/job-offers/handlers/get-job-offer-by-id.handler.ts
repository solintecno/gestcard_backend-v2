import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';
import { GetJobOfferByIdQuery } from '../queries';
import { JobOffer } from '../entities';

@QueryHandler(GetJobOfferByIdQuery)
export class GetJobOfferByIdHandler
  implements IQueryHandler<GetJobOfferByIdQuery>
{
  private readonly logger = new Logger(GetJobOfferByIdHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async execute(query: GetJobOfferByIdQuery): Promise<JobOffer> {
    this.logger.log(`Getting job offer with ID: ${query.id}`);

    const jobOffer = await this.jobOfferRepository.findOne({
      where: {
        id: query.id,
        deletedAt: IsNull(),
      },
      relations: ['creator', 'skills'],
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${query.id} not found`);
    }

    return jobOffer;
  }
}
