import { GoogleAuthDto } from '../dto';

export class CreateGoogleUserCommand {
  constructor(public readonly googleAuthDto: GoogleAuthDto) {}
}
