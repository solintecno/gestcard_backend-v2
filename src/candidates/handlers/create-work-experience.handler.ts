import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateWorkExperienceCommand } from '../commands';
import { Candidate, WorkExperience } from '../entities';
import { WorkExperienceResponseDto } from '../dto';

@CommandHandler(CreateWorkExperienceCommand)
export class CreateWorkExperienceHandler
  implements ICommandHandler<CreateWorkExperienceCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async execute(
    command: CreateWorkExperienceCommand,
  ): Promise<WorkExperienceResponseDto> {
    const { candidateId, createWorkExperienceDto } = command;

    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    const workExperience = this.workExperienceRepository.create({
      ...createWorkExperienceDto,
      startDate: new Date(createWorkExperienceDto.startDate),
      endDate: createWorkExperienceDto.endDate
        ? new Date(createWorkExperienceDto.endDate)
        : undefined,
      candidate,
    });

    const savedWorkExperience =
      await this.workExperienceRepository.save(workExperience);

    return {
      id: savedWorkExperience.id,
      company: savedWorkExperience.company,
      position: savedWorkExperience.position,
      startDate: savedWorkExperience.startDate.toISOString().split('T')[0],
      endDate: savedWorkExperience.endDate?.toISOString().split('T')[0],
      description: savedWorkExperience.description,
      location: savedWorkExperience.location,
      createdAt: savedWorkExperience.createdAt,
      updatedAt: savedWorkExperience.updatedAt,
    };
  }
}
