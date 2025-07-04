import { UpdateEducationDto } from '../dto';

export class UpdateEducationCommand {
  constructor(
    public readonly candidateId: string,
    public readonly educationId: string,
    public readonly updateEducationDto: UpdateEducationDto,
  ) {}
}
