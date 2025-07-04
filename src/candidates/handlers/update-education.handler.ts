import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateEducationCommand } from '../commands';
import { Education } from '../entities';
import { EducationResponseDto } from '../dto';

@CommandHandler(UpdateEducationCommand)
export class UpdateEducationHandler
  implements ICommandHandler<UpdateEducationCommand>
{
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async execute(command: UpdateEducationCommand): Promise<EducationResponseDto> {
    const { educationId, updateEducationDto } = command;

    const education = await this.educationRepository.findOne({
      where: { id: educationId },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${educationId} not found`);
    }

    const updatedEducation = await this.educationRepository.save({
      ...education,
      ...updateEducationDto,
      startDate: updateEducationDto.startDate
        ? new Date(updateEducationDto.startDate)
        : education.startDate,
      endDate: updateEducationDto.endDate
        ? new Date(updateEducationDto.endDate)
        : education.endDate,
    });

    return {
      id: updatedEducation.id,
      institution: updatedEducation.institution,
      field: updatedEducation.field,
      startDate: updatedEducation.startDate,
      endDate: updatedEducation.endDate,
      createdAt: updatedEducation.createdAt,
      updatedAt: updatedEducation.updatedAt,
    };
  }
}
