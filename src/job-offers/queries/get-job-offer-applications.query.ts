export class GetJobOfferApplicationsQuery {
  constructor(
    public readonly jobOfferId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
