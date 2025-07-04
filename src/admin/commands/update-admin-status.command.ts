export class UpdateAdminStatusCommand {
  constructor(
    public readonly adminId: string,
    public readonly isActive: boolean,
  ) {}
}
