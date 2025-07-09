import { IQuery } from '@nestjs/cqrs';

export class GetCandidateCVHistoryQuery implements IQuery {
  constructor(public readonly candidateId: string) {}
}
