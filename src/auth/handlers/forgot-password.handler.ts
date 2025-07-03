import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordCommand } from '../commands';
import { User } from '../entities';

@Injectable()
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ message: string }> {
    const { forgotPasswordData } = command;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordData.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

    // Update user with reset token
    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    // In a real application, you would send an email here
    // For now, we'll just return a success message
    return {
      message: 'Password reset instructions have been sent to your email',
    };
  }
}
