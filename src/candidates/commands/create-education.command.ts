import { CreateEducationDto } from '../dto';

export class CreateEducationCommand {
  constructor(
    public readonly candidateId: string,
    public readonly createEducationDto: CreateEducationDto,
  ) {}
}
