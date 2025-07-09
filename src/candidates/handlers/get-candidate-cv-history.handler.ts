import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateCVHistoryQuery } from '../queries/get-candidate-cv-history.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateCVHistory } from '../entities/candidate-cv-history.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetCandidateCVHistoryQuery)
export class GetCandidateCVHistoryHandler
  implements IQueryHandler<GetCandidateCVHistoryQuery>
{
  constructor(
    @InjectRepository(CandidateCVHistory)
    private readonly cvHistoryRepository: Repository<CandidateCVHistory>,
  ) {}

  async execute(
    query: GetCandidateCVHistoryQuery,
  ): Promise<CandidateCVHistory[]> {
    return this.cvHistoryRepository.find({
      where: { candidate: { id: query.candidateId } },
      order: { uploadedAt: 'DESC' },
    });
  }
}
