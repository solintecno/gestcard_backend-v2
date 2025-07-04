import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCandidatesQuery } from '../queries';
import { Candidate } from '../entities';
import { PaginatedCandidatesResponseDto, CandidateResponseDto } from '../dto';

@QueryHandler(GetCandidatesQuery)
export class GetCandidatesHandler implements IQueryHandler<GetCandidatesQuery> {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    query: GetCandidatesQuery,
  ): Promise<PaginatedCandidatesResponseDto> {
    const { page = 1, limit = 10 } = query.query;

    const [candidates, total] = await this.candidateRepository.findAndCount({
      relations: ['workExperience', 'educationHistory'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: candidates.map((candidate) => this.mapToResponseDto(candidate)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  private mapToResponseDto(candidate: Candidate): CandidateResponseDto {
    return {
      id: candidate.id,
      phone: candidate.phone,
      address: candidate.address,
      dateOfBirth: candidate.dateOfBirth,
      summary: candidate.summary,
      skills: candidate.skills,
      workExperience:
        candidate.workExperience?.map((we) => ({
          id: we.id,
          company: we.company,
          position: we.position,
          startDate: we.startDate.toISOString().split('T')[0],
          endDate: we.endDate?.toISOString().split('T')[0],
          description: we.description,
          location: we.location,
          createdAt: we.createdAt,
          updatedAt: we.updatedAt,
        })) || [],
      educationHistory:
        candidate.educationHistory?.map((edu) => ({
          id: edu.id,
          institution: edu.institution,
          field: edu.field,
          startDate: edu.startDate,
          endDate: edu.endDate,
          createdAt: edu.createdAt,
          updatedAt: edu.updatedAt,
        })) || [],
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
