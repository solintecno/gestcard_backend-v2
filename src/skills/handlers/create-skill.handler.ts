import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import { CreateSkillCommand } from '../commands';
import { Skill } from '../entities';

@CommandHandler(CreateSkillCommand)
export class CreateSkillHandler implements ICommandHandler<CreateSkillCommand> {
  private readonly logger = new Logger(CreateSkillHandler.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(command: CreateSkillCommand): Promise<Skill> {
    const { createSkillDto } = command;
    this.logger.log(`Creating skill with name: ${createSkillDto.name}`);

    // Verificar si ya existe una skill con el mismo nombre
    const existingSkill = await this.skillRepository.findOne({
      where: { name: createSkillDto.name },
    });

    if (existingSkill) {
      throw new ConflictException(
        `Skill with name '${createSkillDto.name}' already exists`,
      );
    }

    const skillData = {
      name: createSkillDto.name,
    };

    const skill = this.skillRepository.create(skillData);
    const savedSkill = await this.skillRepository.save(skill);
    this.logger.log(`Skill created successfully with ID: ${savedSkill.id}`);

    return savedSkill;
  }
}
