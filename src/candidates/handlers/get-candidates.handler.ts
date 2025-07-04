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
      relations: ['workExperience', 'educationHistory', 'ratings'],
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
      rating:
        candidate.ratings && candidate.ratings.length > 0
          ? candidate.ratings.reduce((acc, val) => acc + val.rating, 0) /
            candidate.ratings.length
          : 0,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
