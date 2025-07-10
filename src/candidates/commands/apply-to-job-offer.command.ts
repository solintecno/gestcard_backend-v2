export class ApplyToJobOfferCommand {
  constructor(
    public readonly candidateId: string,
    public readonly jobOfferId: string,
  ) {}
}
