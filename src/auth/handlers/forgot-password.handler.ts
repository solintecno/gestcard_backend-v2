import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Injectable, Logger } from '@nestjs/common';
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
  private logger = new Logger(ForgotPasswordHandler.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ message: string }> {
    const { forgotPasswordData } = command;
    const startTime = Date.now();

    this.logger.log(
      `Starting forgot password process for email: ${forgotPasswordData.email}`,
    );

    try {
      // Find user by email
      this.logger.debug(
        `Searching for user with email: ${forgotPasswordData.email}`,
      );
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordData.email },
      });

      if (!user) {
        this.logger.warn(
          `Password reset attempted for non-existent email: ${forgotPasswordData.email}`,
        );
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User found for password reset: ${user.id}`);

      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

      this.logger.debug(
        `Generated reset token for user ${user.id}, expires at: ${resetExpires.toISOString()}`,
      );

      // Update user with reset token
      await this.userRepository.update(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      });

      this.logger.log(`Password reset token saved for user ${user.id}`);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Forgot password process completed successfully for ${forgotPasswordData.email} in ${duration}ms`,
      );

      // In a real application, you would send an email here
      // For now, we'll just return a success message
      return {
        message: 'Password reset instructions have been sent to your email',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Forgot password process failed for ${forgotPasswordData.email} after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
