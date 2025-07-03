import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { QueryBus } from '@nestjs/cqrs';
import { ValidateUserQuery } from '../queries';
import { User } from '../entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly queryBus: QueryBus) {
    super({
      usernameField: 'email',
    });
    this.logger.log('Local Strategy initialized');
  }

  async validate(email: string, password: string): Promise<User> {
    const startTime = Date.now();
    this.logger.debug(`Local authentication attempt for email: ${email}`);

    try {
      const user = await this.queryBus.execute<ValidateUserQuery, User | null>(
        new ValidateUserQuery(email, password),
      );

      if (!user) {
        this.logger.warn(`Local authentication failed for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const duration = Date.now() - startTime;
      this.logger.debug(
        `Local authentication successful for user: ${user.id} in ${duration}ms`,
      );

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Local authentication error for ${email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
