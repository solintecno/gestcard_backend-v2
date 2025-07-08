import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetFullCandidateByIdQuery } from '../queries/get-full-candidate-by-id.query';
import { Candidate } from '../entities';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetFullCandidateByIdQuery)
export class GetFullCandidateByIdHandler
  implements IQueryHandler<GetFullCandidateByIdQuery>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(query: GetFullCandidateByIdQuery): Promise<any> {
    const candidate = await this.candidateRepository.findOne({
      where: { id: query.id },
      relations: ['skills', 'educationHistory', 'workExperience'],
    });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }
}
