import { ICommand } from '@nestjs/cqrs';
import { LoginDto } from '../dto';

export class LoginUserCommand implements ICommand {
  constructor(public readonly loginData: LoginDto) {}
}
