import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByIdQuery } from '../queries';
import { User } from '../entities';

@Injectable()
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  private readonly logger = new Logger(GetUserByIdHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    const { userId } = query;
    const startTime = Date.now();

    this.logger.debug(`Fetching user by ID: ${userId}`);

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      const duration = Date.now() - startTime;
      if (user) {
        this.logger.debug(
          `User found: ${user.id} (${user.email}) in ${duration}ms`,
        );
      } else {
        this.logger.debug(`User not found with ID: ${userId} in ${duration}ms`);
      }

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Failed to fetch user by ID ${userId} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
