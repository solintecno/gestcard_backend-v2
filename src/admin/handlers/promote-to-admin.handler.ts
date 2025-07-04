import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { UserRole } from '../../shared/enums';
import { PromoteToAdminCommand } from '../commands/promote-to-admin.command';

@CommandHandler(PromoteToAdminCommand)
export class PromoteToAdminHandler
  implements ICommandHandler<PromoteToAdminCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: PromoteToAdminCommand): Promise<User> {
    const { userId } = command;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('User is already an admin');
    }

    user.role = UserRole.ADMIN;
    return await this.userRepository.save(user);
  }
}
