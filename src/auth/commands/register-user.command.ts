import { ICommand } from '@nestjs/cqrs';
import { RegisterDto } from '../dto';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly registerData: RegisterDto) {}
}
