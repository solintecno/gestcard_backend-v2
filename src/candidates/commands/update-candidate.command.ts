import { UpdateCandidateDto } from '../dto';

export class UpdateCandidateCommand {
  constructor(
    public readonly id: string,
    public readonly updateCandidateDto: UpdateCandidateDto,
  ) {}
}
