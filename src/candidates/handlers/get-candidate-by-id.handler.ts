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
      relations: ['workExperience', 'educationHistory', 'ratings'],
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
