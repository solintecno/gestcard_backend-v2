import { UpdateCandidateRatingDto } from '../dto';

export class UpdateCandidateRatingCommand {
  constructor(
    public readonly id: string,
    public readonly updateCandidateRatingDto: UpdateCandidateRatingDto,
  ) {}
}
