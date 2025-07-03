import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginUserCommand } from '../commands';
import { User } from '../entities';

@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<{ user: User; accessToken: string }> {
    const { loginData } = command;
    const startTime = Date.now();

    this.logger.log(`Login attempt for email: ${loginData.email}`);

    try {
      // Find user by email
      this.logger.debug(`Searching for user with email: ${loginData.email}`);
      const user = await this.userRepository.findOne({
        where: { email: loginData.email },
      });

      if (!user) {
        this.logger.warn(`Login failed - User not found: ${loginData.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.debug(`User found: ${user.id}`);

      // Check if user is active
      if (!user.isActive) {
        this.logger.warn(
          `Login failed - Account deactivated for user: ${user.id}`,
        );
        throw new UnauthorizedException('Account is deactivated');
      }

      this.logger.debug(`Verifying password for user: ${user.id}`);

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password,
      );
      if (!isPasswordValid) {
        this.logger.warn(
          `Login failed - Invalid password for user: ${user.id}`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.debug(
        `Password verification successful for user: ${user.id}`,
      );

      // Generate JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`JWT token generated for user: ${user.id}`);

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      const duration = Date.now() - startTime;
      this.logger.log(
        `Login successful for user: ${user.id} (${loginData.email}) in ${duration}ms`,
      );

      return {
        user: userWithoutPassword as User,
        accessToken,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Login failed for ${loginData.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
