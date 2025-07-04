export class DeleteWorkExperienceCommand {
  constructor(
    public readonly candidateId: string,
    public readonly workExperienceId: string,
  ) {}
}
