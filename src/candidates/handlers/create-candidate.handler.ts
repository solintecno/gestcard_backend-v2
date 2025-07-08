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
    const { createCandidateDto, userId } = command;

    const candidate = this.candidateRepository.create({
      id: userId,
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
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
