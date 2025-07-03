import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ValidateUserQuery } from '../queries';
import { User } from '../entities';

@Injectable()
@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
  private readonly logger = new Logger(ValidateUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: ValidateUserQuery): Promise<User | null> {
    const { email, password } = query;
    const startTime = Date.now();

    this.logger.debug(`Validating user credentials for: ${email}`);

    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        const duration = Date.now() - startTime;
        this.logger.debug(
          `User validation failed - User not found: ${email} in ${duration}ms`,
        );
        return null;
      }

      if (!user.isActive) {
        const duration = Date.now() - startTime;
        this.logger.debug(
          `User validation failed - Account inactive: ${user.id} in ${duration}ms`,
        );
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      const duration = Date.now() - startTime;

      if (!isPasswordValid) {
        this.logger.debug(
          `User validation failed - Invalid password for: ${user.id} in ${duration}ms`,
        );
        return null;
      }

      this.logger.debug(
        `User validation successful for: ${user.id} in ${duration}ms`,
      );
      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `User validation error for ${email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      return null;
    }
  }
}
