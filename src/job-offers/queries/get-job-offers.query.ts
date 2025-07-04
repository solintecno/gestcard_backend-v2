import { EmploymentType, JobOfferStatus } from '../../shared/enums';

export class GetJobOffersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly search?: string,
    public readonly location?: string,
    public readonly company?: string,
    public readonly employmentType?: EmploymentType,
    public readonly status?: JobOfferStatus,
    public readonly minSalary?: number,
    public readonly maxSalary?: number,
  ) {}
}
