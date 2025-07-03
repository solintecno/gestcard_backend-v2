export class GetJobOffersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly search?: string,
    public readonly location?: string,
    public readonly company?: string,
    public readonly employmentType?:
      | 'FULL_TIME'
      | 'PART_TIME'
      | 'CONTRACT'
      | 'INTERNSHIP',
    public readonly status?: 'ACTIVE' | 'INACTIVE' | 'CLOSED',
    public readonly minSalary?: number,
    public readonly maxSalary?: number,
  ) {}
}
