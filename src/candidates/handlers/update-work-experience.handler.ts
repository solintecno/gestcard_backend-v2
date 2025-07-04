import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateWorkExperienceCommand } from '../commands';
import { WorkExperience } from '../entities';
import { WorkExperienceResponseDto } from '../dto';

@CommandHandler(UpdateWorkExperienceCommand)
export class UpdateWorkExperienceHandler
  implements ICommandHandler<UpdateWorkExperienceCommand>
{
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async execute(
    command: UpdateWorkExperienceCommand,
  ): Promise<WorkExperienceResponseDto> {
    const { workExperienceId, updateWorkExperienceDto } = command;

    const workExperience = await this.workExperienceRepository.findOne({
      where: { id: workExperienceId },
    });

    if (!workExperience) {
      throw new NotFoundException(
        `Work experience with ID ${workExperienceId} not found`,
      );
    }

    const updatedWorkExperience = await this.workExperienceRepository.save({
      ...workExperience,
      ...updateWorkExperienceDto,
      startDate: updateWorkExperienceDto.startDate
        ? new Date(updateWorkExperienceDto.startDate)
        : workExperience.startDate,
      endDate: updateWorkExperienceDto.endDate
        ? new Date(updateWorkExperienceDto.endDate)
        : workExperience.endDate,
    });

    return {
      id: updatedWorkExperience.id,
      company: updatedWorkExperience.company,
      position: updatedWorkExperience.position,
      startDate: updatedWorkExperience.startDate.toISOString().split('T')[0],
      endDate: updatedWorkExperience.endDate?.toISOString().split('T')[0],
      description: updatedWorkExperience.description,
      location: updatedWorkExperience.location,
      createdAt: updatedWorkExperience.createdAt,
      updatedAt: updatedWorkExperience.updatedAt,
    };
  }
}
