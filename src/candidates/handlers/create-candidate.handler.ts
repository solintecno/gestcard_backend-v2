import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateCommand } from '../commands';
import { Candidate } from '../entities';
import { CandidateResponseDto } from '../dto';

@CommandHandler(CreateCandidateCommand)
export class CreateCandidateHandler
  implements ICommandHandler<CreateCandidateCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    command: CreateCandidateCommand,
  ): Promise<CandidateResponseDto> {
    const { createCandidateDto } = command;

    const candidate = this.candidateRepository.create({
      ...createCandidateDto,
      dateOfBirth: createCandidateDto.dateOfBirth
        ? new Date(createCandidateDto.dateOfBirth)
        : undefined,
    });

    const savedCandidate = await this.candidateRepository.save(candidate);

    return this.mapToResponseDto(savedCandidate);
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
