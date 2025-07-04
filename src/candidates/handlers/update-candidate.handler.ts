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

  async execute(command: UpdateCandidateCommand): Promise<CandidateResponseDto> {
    const { id, updateCandidateDto } = command;

    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['workExperience', 'educationHistory'],
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
