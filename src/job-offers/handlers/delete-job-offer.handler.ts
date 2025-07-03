import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';
import { DeleteJobOfferCommand } from '../commands';
import { JobOffer } from '../entities';

@CommandHandler(DeleteJobOfferCommand)
export class DeleteJobOfferHandler
  implements ICommandHandler<DeleteJobOfferCommand>
{
  private readonly logger = new Logger(DeleteJobOfferHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async execute(command: DeleteJobOfferCommand): Promise<void> {
    this.logger.log(`Deleting job offer with ID: ${command.id}`);

    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: command.id },
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${command.id} not found`);
    }

    try {
      await this.jobOfferRepository.remove(jobOffer);
      this.logger.log(`Job offer deleted successfully with ID: ${command.id}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to delete job offer: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
