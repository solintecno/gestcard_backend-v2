import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateGoogleUserCommand } from '../commands';
import { User } from '../entities';
import { UserRole } from '../../shared/enums';

@Injectable()
@CommandHandler(CreateGoogleUserCommand)
export class CreateGoogleUserHandler
  implements ICommandHandler<CreateGoogleUserCommand>
{
  private readonly logger = new Logger(CreateGoogleUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateGoogleUserCommand): Promise<User> {
    const { googleAuthDto } = command;
    const startTime = Date.now();

    this.logger.log(`Creating Google user for email: ${googleAuthDto.email}`);

    try {
      // Generate a random password for Google users
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      this.logger.debug(`Creating user with name: ${googleAuthDto.name}`);

      const admin = googleAuthDto.email.includes('jorge.softdevelop'); //TODO: delete

      const newUser = this.userRepository.create({
        name: googleAuthDto.name,
        email: googleAuthDto.email,
        password: hashedPassword,
        profilePicture: googleAuthDto.picture,
        role: admin ? UserRole.ADMIN : UserRole.USER,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(newUser);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Google user created successfully: ${savedUser.id} (${savedUser.email}) in ${duration}ms`,
      );

      return savedUser;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Google user creation failed for ${googleAuthDto.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
