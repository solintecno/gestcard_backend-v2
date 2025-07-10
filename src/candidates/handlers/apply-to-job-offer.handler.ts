import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ApplyToJobOfferCommand } from '../commands/apply-to-job-offer.command';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer, JobApplication } from '../../job-offers/entities';

@CommandHandler(ApplyToJobOfferCommand)
export class ApplyToJobOfferHandler
  implements ICommandHandler<ApplyToJobOfferCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async execute(command: ApplyToJobOfferCommand): Promise<any> {
    const { candidateId, jobOfferId } = command;

    // 1. Verifica que el candidato existe
    const candidate = await this.candidateRepository.findOne({
      where: { id: candidateId },
    });
    if (!candidate) {
      throw new NotFoundException('Candidato no encontrado');
    }

    // 2. Verifica que la oferta existe
    const jobOffer = await this.jobOfferRepository.findOne({
      where: { id: jobOfferId },
    });
    if (!jobOffer) {
      throw new NotFoundException('Oferta de trabajo no encontrada');
    }

    // 3. Verifica que no exista ya una aplicación
    const existing = await this.jobApplicationRepository.findOne({
      where: { candidateId, jobOfferId },
    });
    if (existing) {
      throw new ConflictException('Ya existe una aplicación para esta oferta');
    }

    // 4. Crea la aplicación
    const application = this.jobApplicationRepository.create({
      candidateId,
      jobOfferId,
      status: 'PENDING',
      appliedAt: new Date(),
    });
    await this.jobApplicationRepository.save(application);

    return { success: true, message: 'Aplicación realizada exitosamente' };
  }
}
