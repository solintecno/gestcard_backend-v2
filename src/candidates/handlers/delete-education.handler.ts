import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteEducationCommand } from '../commands';
import { Education } from '../entities';

@CommandHandler(DeleteEducationCommand)
export class DeleteEducationHandler
  implements ICommandHandler<DeleteEducationCommand>
{
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async execute(command: DeleteEducationCommand): Promise<void> {
    const { educationId } = command;

    const education = await this.educationRepository.findOne({
      where: { id: educationId },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${educationId} not found`);
    }

    await this.educationRepository.remove(education);
  }
}
