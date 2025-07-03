import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordCommand } from '../commands';
import { User } from '../entities';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  private readonly logger = new Logger(ResetPasswordHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ message: string }> {
    const { resetPasswordData } = command;
    const startTime = Date.now();

    this.logger.log(
      `Password reset attempt with token: ${resetPasswordData.token.substring(0, 8)}...`,
    );

    try {
      // Find user with valid reset token
      this.logger.debug('Searching for user with valid reset token');
      const user = await this.userRepository.findOne({
        where: {
          resetPasswordToken: resetPasswordData.token,
          resetPasswordExpires: MoreThan(new Date()),
        },
      });

      if (!user) {
        this.logger.warn(
          `Password reset failed - Invalid or expired token: ${resetPasswordData.token.substring(0, 8)}...`,
        );
        throw new BadRequestException('Invalid or expired reset token');
      }

      this.logger.log(`Valid reset token found for user: ${user.id}`);

      // Hash new password
      const saltRounds = 12;
      this.logger.debug(`Hashing new password with ${saltRounds} salt rounds`);
      const hashedPassword = await bcrypt.hash(
        resetPasswordData.password,
        saltRounds,
      );

      // Update user password and clear reset token
      this.logger.debug(
        `Updating password and clearing reset token for user: ${user.id}`,
      );
      await this.userRepository.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });

      const duration = Date.now() - startTime;
      this.logger.log(
        `Password reset completed successfully for user: ${user.id} in ${duration}ms`,
      );

      return {
        message: 'Password has been successfully reset',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Password reset failed after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
