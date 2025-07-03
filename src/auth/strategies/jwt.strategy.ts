import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries';
import { User } from '../entities';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.log('JWT Strategy initialized');
  }

  async validate(payload: JwtPayload): Promise<User> {
    const startTime = Date.now();
    this.logger.debug(
      `JWT validation for user: ${payload.sub} (${payload.email})`,
    );

    try {
      const user = await this.queryBus.execute<GetUserByIdQuery, User | null>(
        new GetUserByIdQuery(payload.sub),
      );

      if (!user || !user.isActive) {
        this.logger.warn(
          `JWT validation failed - User not found or inactive: ${payload.sub}`,
        );
        throw new UnauthorizedException('User not found or inactive');
      }

      const duration = Date.now() - startTime;
      this.logger.debug(
        `JWT validation successful for user: ${user.id} in ${duration}ms`,
      );

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `JWT validation failed for user ${payload.sub} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
