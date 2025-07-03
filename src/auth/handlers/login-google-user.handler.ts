import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginGoogleUserCommand } from '../commands';
import { User } from '../entities';

@Injectable()
@CommandHandler(LoginGoogleUserCommand)
export class LoginGoogleUserHandler
  implements ICommandHandler<LoginGoogleUserCommand>
{
  private readonly logger = new Logger(LoginGoogleUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: LoginGoogleUserCommand,
  ): Promise<{ user: User; accessToken: string }> {
    const { email } = command;
    const startTime = Date.now();

    this.logger.log(`Google login attempt for email: ${email}`);

    try {
      // Find user by email
      this.logger.debug(`Searching for user with email: ${email}`);
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`Google login failed - User not found: ${email}`);
        throw new NotFoundException('User not found');
      }

      this.logger.debug(`User found: ${user.id}`);

      // Generate JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`JWT token generated for Google user: ${user.id}`);

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      const duration = Date.now() - startTime;
      this.logger.log(
        `Google login successful for user: ${user.id} (${email}) in ${duration}ms`,
      );

      return {
        user: userWithoutPassword as User,
        accessToken,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Google login failed for ${email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
