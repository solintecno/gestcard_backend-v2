import { CreateSkillDto } from '../dto';

export class CreateSkillCommand {
  constructor(public readonly createSkillDto: CreateSkillDto) {}
}
