import { UpdateWorkExperienceDto } from '../dto';

export class UpdateWorkExperienceCommand {
  constructor(
    public readonly candidateId: string,
    public readonly workExperienceId: string,
    public readonly updateWorkExperienceDto: UpdateWorkExperienceDto,
  ) {}
}
