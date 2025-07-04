import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCandidateCommand } from '../commands';
import { Candidate } from '../entities';
import { CandidateResponseDto } from '../dto';

@CommandHandler(UpdateCandidateCommand)
export class UpdateCandidateHandler
  implements ICommandHandler<UpdateCandidateCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    command: UpdateCandidateCommand,
  ): Promise<CandidateResponseDto> {
    const { id, updateCandidateDto } = command;

    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    const updatedCandidate = await this.candidateRepository.save({
      ...candidate,
      ...updateCandidateDto,
      dateOfBirth: updateCandidateDto.dateOfBirth
        ? new Date(updateCandidateDto.dateOfBirth)
        : candidate.dateOfBirth,
    });

    return this.mapToResponseDto(updatedCandidate);
  }

  private mapToResponseDto(candidate: Candidate): CandidateResponseDto {
    return {
      id: candidate.id,
      phone: candidate.phone,
      address: candidate.address,
      dateOfBirth: candidate.dateOfBirth,
      summary: candidate.summary,
      skills: candidate.skills,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
