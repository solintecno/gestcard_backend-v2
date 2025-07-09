import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../entities/candidate.entity';
import { CandidateCVHistory } from '../entities/candidate-cv-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CandidateCVHistoryService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(CandidateCVHistory)
    private readonly cvHistoryRepository: Repository<CandidateCVHistory>,
  ) {}

  async addCVHistory(
    candidateId: string,
    cvPath: string,
  ): Promise<CandidateCVHistory> {
    const candidate = await this.candidateRepository.findOneByOrFail({
      id: candidateId,
    });
    const history = this.cvHistoryRepository.create({ candidate, cvPath });
    return this.cvHistoryRepository.save(history);
  }
}
