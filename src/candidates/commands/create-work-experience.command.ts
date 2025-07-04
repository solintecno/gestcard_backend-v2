import { CreateWorkExperienceDto } from '../dto';

export class CreateWorkExperienceCommand {
  constructor(
    public readonly candidateId: string,
    public readonly createWorkExperienceDto: CreateWorkExperienceDto,
  ) {}
}
