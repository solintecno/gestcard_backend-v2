import { UpdateSkillDto } from '../dto';

export class UpdateSkillCommand {
  constructor(
    public readonly id: string,
    public readonly updateSkillDto: UpdateSkillDto,
  ) {}
}
