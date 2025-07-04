import { EmploymentType, JobOfferStatus } from '../../shared/enums';

export class CreateJobOfferCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly company: string,
    public readonly location: string,
    public readonly createdBy: string,
    public readonly salary?: string,
    public readonly employmentType?: EmploymentType,
    public readonly status?: JobOfferStatus,
    public readonly requirements?: string[],
    public readonly benefits?: string[],
    public readonly experienceLevel?: string,
    public readonly applicationDeadline?: Date,
    public readonly skillIds?: string[],
  ) {}
}
