import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByEmailQuery } from '../queries';
import { User } from '../entities';

@Injectable()
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  private readonly logger = new Logger(GetUserByEmailHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    const { email } = query;
    const startTime = Date.now();

    this.logger.debug(`Fetching user by email: ${email}`);

    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      const duration = Date.now() - startTime;
      if (user) {
        this.logger.debug(
          `User found: ${user.id} (${user.email}) in ${duration}ms`,
        );
      } else {
        this.logger.debug(
          `User not found with email: ${email} in ${duration}ms`,
        );
      }

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Failed to fetch user by email ${email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
