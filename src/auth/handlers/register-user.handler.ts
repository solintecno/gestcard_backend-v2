import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUserCommand } from '../commands';
import { User } from '../entities';
import { UserRole } from '../../shared/enums';

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  private readonly logger = new Logger(RegisterUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { registerData } = command;
    const startTime = Date.now();

    this.logger.log(
      `Registration attempt for email: ${registerData.email}, role: ${registerData.role || UserRole.USER}`,
    );

    try {
      // Check if user already exists
      this.logger.debug(
        `Checking if user exists with email: ${registerData.email}`,
      );
      const existingUser = await this.userRepository.findOne({
        where: { email: registerData.email },
      });

      if (existingUser) {
        this.logger.warn(
          `Registration failed - User already exists: ${registerData.email}`,
        );
        throw new ConflictException('User with this email already exists');
      }

      this.logger.debug(`Email available, proceeding with registration`);

      // Hash password
      const saltRounds = 12;
      this.logger.debug(`Hashing password with ${saltRounds} salt rounds`);
      const hashedPassword = await bcrypt.hash(
        registerData.password,
        saltRounds,
      );

      // Create new user
      const emailVerificationToken = uuidv4();
      this.logger.debug(
        `Creating user with verification token: ${emailVerificationToken}`,
      );

      const newUser = this.userRepository.create({
        ...registerData,
        password: hashedPassword,
        role: registerData.role || UserRole.USER,
        emailVerificationToken,
      });

      const savedUser = await this.userRepository.save(newUser);

      const duration = Date.now() - startTime;
      this.logger.log(
        `User registered successfully: ${savedUser.id} (${savedUser.email}) with role ${savedUser.role} in ${duration}ms`,
      );

      return savedUser;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Registration failed for ${registerData.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
