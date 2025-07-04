import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteWorkExperienceCommand } from '../commands';
import { WorkExperience } from '../entities';

@CommandHandler(DeleteWorkExperienceCommand)
export class DeleteWorkExperienceHandler
  implements ICommandHandler<DeleteWorkExperienceCommand>
{
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async execute(command: DeleteWorkExperienceCommand): Promise<void> {
    const { workExperienceId } = command;

    const workExperience = await this.workExperienceRepository.findOne({
      where: { id: workExperienceId },
    });

    if (!workExperience) {
      throw new NotFoundException(
        `Work experience with ID ${workExperienceId} not found`,
      );
    }

    await this.workExperienceRepository.remove(workExperience);
  }
}
