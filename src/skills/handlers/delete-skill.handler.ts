import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';
import { DeleteSkillCommand } from '../commands';
import { Skill } from '../entities';

@CommandHandler(DeleteSkillCommand)
export class DeleteSkillHandler implements ICommandHandler<DeleteSkillCommand> {
  private readonly logger = new Logger(DeleteSkillHandler.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(command: DeleteSkillCommand): Promise<void> {
    const { id } = command;
    this.logger.log(`Deleting skill with ID: ${id}`);

    // Verificar que la skill existe
    const existingSkill = await this.skillRepository.findOne({
      where: { id },
    });

    if (!existingSkill) {
      throw new NotFoundException(`Skill with ID '${id}' not found`);
    }

    // Eliminar la skill
    await this.skillRepository.softDelete(id);

    this.logger.log(`Skill '${existingSkill.name}' deleted successfully`);
  }
}
