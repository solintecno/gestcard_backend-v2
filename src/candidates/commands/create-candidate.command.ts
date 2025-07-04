import { CreateCandidateDto } from '../dto';

export class CreateCandidateCommand {
  constructor(public readonly createCandidateDto: CreateCandidateDto) {}
}
