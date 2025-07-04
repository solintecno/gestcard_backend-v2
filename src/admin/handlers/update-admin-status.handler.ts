import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { UserRole } from '../../shared/enums';
import { UpdateAdminStatusCommand } from '../commands/update-admin-status.command';

@CommandHandler(UpdateAdminStatusCommand)
export class UpdateAdminStatusHandler
  implements ICommandHandler<UpdateAdminStatusCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateAdminStatusCommand): Promise<User> {
    const { adminId, isActive } = command;

    const user = await this.userRepository.findOne({
      where: { id: adminId, role: UserRole.ADMIN },
    });

    if (!user) {
      throw new NotFoundException('Admin not found');
    }

    user.isActive = isActive;
    return await this.userRepository.save(user);
  }
}
