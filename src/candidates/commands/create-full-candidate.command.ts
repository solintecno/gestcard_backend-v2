import { CreateFullCandidateDto } from '../dto/create-full-candidate.dto';

export class CreateFullCandidateCommand {
  constructor(
    public readonly userId: string,
    public readonly createFullCandidateDto: CreateFullCandidateDto,
  ) {}
}
