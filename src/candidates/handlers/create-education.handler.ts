import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateEducationCommand } from '../commands';
import { Candidate, Education } from '../entities';
import { EducationResponseDto } from '../dto';

@CommandHandler(CreateEducationCommand)
export class CreateEducationHandler
  implements ICommandHandler<CreateEducationCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async execute(
    command: CreateEducationCommand,
  ): Promise<EducationResponseDto> {
    const { candidateId, createEducationDto } = command;

    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    const education = this.educationRepository.create({
      ...createEducationDto,
      startDate: new Date(createEducationDto.startDate),
      endDate: createEducationDto.endDate
        ? new Date(createEducationDto.endDate)
        : undefined,
      candidate,
    });

    const savedEducation = await this.educationRepository.save(education);

    return {
      id: savedEducation.id,
      institution: savedEducation.institution,
      field: savedEducation.field,
      startDate: savedEducation.startDate,
      endDate: savedEducation.endDate,
      createdAt: savedEducation.createdAt,
      updatedAt: savedEducation.updatedAt,
    };
  }
}
