import { IQuery } from '@nestjs/cqrs';

export class GetCandidateJobApplicationsQuery implements IQuery {
  constructor(
    public readonly candidateId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
