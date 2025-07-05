import { UserRole } from 'src/shared/enums';

export class GetAdminsQuery {
  constructor(
    public readonly isActive?: boolean,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly role: UserRole = UserRole.ADMIN,
  ) {}
}
