import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { UpdateSkillCommand } from '../commands';
import { Skill } from '../entities';

@CommandHandler(UpdateSkillCommand)
export class UpdateSkillHandler implements ICommandHandler<UpdateSkillCommand> {
  private readonly logger = new Logger(UpdateSkillHandler.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(command: UpdateSkillCommand): Promise<Skill> {
    const { id, updateSkillDto } = command;
    this.logger.log(`Updating skill with ID: ${id}`);

    // Verificar que la skill existe
    const existingSkill = await this.skillRepository.findOne({
      where: { id },
    });

    if (!existingSkill) {
      throw new NotFoundException(`Skill with ID '${id}' not found`);
    }

    // Si se está actualizando el nombre, verificar que no exista otra skill con ese nombre
    if (updateSkillDto.name && updateSkillDto.name !== existingSkill.name) {
      const skillWithSameName = await this.skillRepository.findOne({
        where: { name: updateSkillDto.name },
      });

      if (skillWithSameName) {
        throw new ConflictException(
          `Skill with name '${updateSkillDto.name}' already exists`,
        );
      }
    }

    // Actualizar la skill
    await this.skillRepository.update(id, updateSkillDto);

    // Obtener la skill actualizada
    const updatedSkill = await this.skillRepository.findOne({
      where: { id },
    });

    if (!updatedSkill) {
      throw new NotFoundException(
        `Skill with ID '${id}' not found after update`,
      );
    }

    this.logger.log(`Skill updated successfully: ${updatedSkill.name}`);
    return updatedSkill;
  }
}
