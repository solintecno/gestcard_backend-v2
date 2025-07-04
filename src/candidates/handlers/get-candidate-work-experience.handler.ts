import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetCandidateWorkExperienceQuery } from '../queries';
import { WorkExperience, Candidate } from '../entities';
import { WorkExperienceResponseDto } from '../dto';

@QueryHandler(GetCandidateWorkExperienceQuery)
export class GetCandidateWorkExperienceHandler
  implements IQueryHandler<GetCandidateWorkExperienceQuery>
{
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    query: GetCandidateWorkExperienceQuery,
  ): Promise<WorkExperienceResponseDto[]> {
    const { candidateId } = query;

    // First check if candidate exists
    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    const workExperiences = await this.workExperienceRepository.find({
      where: { candidate: { id: candidateId } },
      order: { startDate: 'DESC' },
    });

    return workExperiences.map((we) => ({
      id: we.id,
      company: we.company,
      position: we.position,
      startDate: we.startDate.toISOString().split('T')[0],
      endDate: we.endDate?.toISOString().split('T')[0],
      description: we.description,
      location: we.location,
      createdAt: we.createdAt,
      updatedAt: we.updatedAt,
    }));
  }
}
