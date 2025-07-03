export class CreateJobOfferCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly company: string,
    public readonly location: string,
    public readonly createdBy: string,
    public readonly salary?: number,
    public readonly employmentType?:
      | 'FULL_TIME'
      | 'PART_TIME'
      | 'CONTRACT'
      | 'INTERNSHIP',
    public readonly status?: 'ACTIVE' | 'INACTIVE' | 'CLOSED',
    public readonly requirements?: string[],
    public readonly benefits?: string[],
    public readonly experienceLevel?: string,
    public readonly applicationDeadline?: Date,
  ) {}
}
