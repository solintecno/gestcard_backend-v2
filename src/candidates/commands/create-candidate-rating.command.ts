import { CreateCandidateRatingDto } from '../dto';

export class CreateCandidateRatingCommand {
  constructor(
    public readonly createCandidateRatingDto: CreateCandidateRatingDto,
  ) {}
}
