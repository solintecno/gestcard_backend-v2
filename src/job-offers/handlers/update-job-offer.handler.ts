import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, Logger } from '@nestjs/common';
import { UpdateJobOfferCommand } from '../commands';
import { JobOffer } from '../entities';

@CommandHandler(UpdateJobOfferCommand)
export class UpdateJobOfferHandler
  implements ICommandHandler<UpdateJobOfferCommand>
{
  private readonly logger = new Logger(UpdateJobOfferHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
  ) {}

  async execute(command: UpdateJobOfferCommand): Promise<JobOffer> {
    this.logger.log(`Updating job offer with ID: ${command.id}`);

    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: command.id },
    });

    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${command.id} not found`);
    }

    try {
      // Update only provided fields
      if (command.title !== undefined) jobOffer.title = command.title;
      if (command.description !== undefined) {
        jobOffer.description = command.description;
      }
      if (command.company !== undefined) jobOffer.company = command.company;
      if (command.location !== undefined) jobOffer.location = command.location;
      if (command.salary !== undefined) jobOffer.salary = command.salary;
      if (command.employmentType !== undefined) {
        jobOffer.employmentType = command.employmentType;
      }
      if (command.status !== undefined) jobOffer.status = command.status;
      if (command.requirements !== undefined) {
        jobOffer.requirements = command.requirements;
      }
      if (command.benefits !== undefined) {
        jobOffer.benefits = command.benefits;
      }
      if (command.experienceLevel !== undefined) {
        jobOffer.experienceLevel = command.experienceLevel;
      }
      if (command.applicationDeadline !== undefined) {
        jobOffer.applicationDeadline = command.applicationDeadline;
      }

      const updatedJobOffer = await this.jobOfferRepository.save(jobOffer);

      this.logger.log(
        `Job offer updated successfully with ID: ${updatedJobOffer.id}`,
      );
      return updatedJobOffer;
    } catch (error: any) {
      this.logger.error(
        `Failed to update job offer: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
