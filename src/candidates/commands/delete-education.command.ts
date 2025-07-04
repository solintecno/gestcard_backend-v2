export class DeleteEducationCommand {
  constructor(
    public readonly candidateId: string,
    public readonly educationId: string,
  ) {}
}
