import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const { registerData } = command;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerData.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

    // Create new user
    const newUser = this.userRepository.create({
      ...registerData,
      password: hashedPassword,
      role: registerData.role || UserRole.USER,
      emailVerificationToken: uuidv4(),
    });

    return await this.userRepository.save(newUser);
  }
}
