import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetCandidateByIdQuery } from '../queries';
import { Candidate } from '../entities';
import { CandidateResponseDto } from '../dto';

@QueryHandler(GetCandidateByIdQuery)
export class GetCandidateByIdHandler
  implements IQueryHandler<GetCandidateByIdQuery>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(query: GetCandidateByIdQuery): Promise<CandidateResponseDto> {
    const { id } = query;

    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    return this.mapToResponseDto(candidate);
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
          ? candidate.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
            candidate.ratings.length
          : null,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
