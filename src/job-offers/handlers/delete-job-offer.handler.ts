import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';
import { DeleteJobOfferCommand } from '../commands';
import { JobOffer } from '../entities';
import { JobApplication } from '../entities/job-application.entity';

@CommandHandler(DeleteJobOfferCommand)
export class DeleteJobOfferHandler
  implements ICommandHandler<DeleteJobOfferCommand>
{
  private readonly logger = new Logger(DeleteJobOfferHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async execute(command: DeleteJobOfferCommand): Promise<void> {
    this.logger.log(`Deleting job offer with ID: ${command.id}`);

    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: command.id },
      relations: ['applications'],
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${command.id} not found`);
    }

    try {
      // Soft delete de todas las aplicaciones asociadas
      if (jobOffer.applications && jobOffer.applications.length > 0) {
        for (const application of jobOffer.applications) {
          await this.jobApplicationRepository.softRemove(application);
        }
        this.logger.log(
          `Soft deleted ${jobOffer.applications.length} applications for job offer ${command.id}`,
        );
      }
      await this.jobOfferRepository.softRemove(jobOffer);
      this.logger.log(
        `Job offer soft deleted successfully with ID: ${command.id}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to soft delete job offer: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
