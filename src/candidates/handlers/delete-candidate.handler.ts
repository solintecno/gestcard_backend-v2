import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCandidateCommand } from '../commands';
import { Candidate } from '../entities';

@CommandHandler(DeleteCandidateCommand)
export class DeleteCandidateHandler
  implements ICommandHandler<DeleteCandidateCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(command: DeleteCandidateCommand): Promise<void> {
    const { id } = command;

    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    await this.candidateRepository.remove(candidate);
  }
}
