import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import { CreateJobOfferCommand } from '../commands';
import { JobOffer } from '../entities';
import { Skill } from '../../skills/entities';
import { EmploymentType, JobOfferStatus } from '../../shared/enums';

@CommandHandler(CreateJobOfferCommand)
export class CreateJobOfferHandler
  implements ICommandHandler<CreateJobOfferCommand>
{
  private readonly logger = new Logger(CreateJobOfferHandler.name);

  constructor(
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(command: CreateJobOfferCommand): Promise<JobOffer> {
    this.logger.log(
      `Creating job offer with title: ${command.title} for company: ${command.company}`,
    );

    try {
      // Buscar skills si se proporcionan IDs
      let skills: Skill[] = [];
      if (command.skillIds && command.skillIds.length > 0) {
        skills = await this.skillRepository.findByIds(command.skillIds);
        this.logger.log(`Found ${skills.length} skills for job offer`);
      }

      const jobOffer = this.jobOfferRepository.create({
        title: command.title,
        description: command.description,
        company: command.company,
        location: command.location,
        createdBy: command.createdBy,
        salary: command.salary,
        employmentType: command.employmentType || EmploymentType.FULL_TIME,
        status: command.status || JobOfferStatus.ACTIVE,
        requirements: command.requirements || [],
        benefits: command.benefits || [],
        experienceLevel: command.experienceLevel,
        applicationDeadline: command.applicationDeadline,
        skills: skills,
      });

      const savedJobOffer = await this.jobOfferRepository.save(jobOffer);

      this.logger.log(
        `Job offer created successfully with ID: ${savedJobOffer.id}`,
      );
      return savedJobOffer;
    } catch (error: any) {
      this.logger.error(
        `Failed to create job offer: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new ConflictException('Failed to create job offer');
    }
  }
}
