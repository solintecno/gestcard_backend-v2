import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetCandidateEducationHistoryQuery } from '../queries';
import { Education, Candidate } from '../entities';
import { EducationResponseDto } from '../dto';

@QueryHandler(GetCandidateEducationHistoryQuery)
export class GetCandidateEducationHistoryHandler
  implements IQueryHandler<GetCandidateEducationHistoryQuery>
{
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    query: GetCandidateEducationHistoryQuery,
  ): Promise<EducationResponseDto[]> {
    const { candidateId } = query;

    // First check if candidate exists
    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    const educationHistory = await this.educationRepository.find({
      where: { candidate: { id: candidateId } },
      order: { startDate: 'DESC' },
    });

    return educationHistory.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      createdAt: edu.createdAt,
      updatedAt: edu.updatedAt,
    }));
  }
}
