import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadCandidateCVHandler } from './handlers/upload-candidate-cv.handler';
import { ResourcesController } from './resources.controller';
import { CandidateCVHistoryService } from '../candidates/services/candidate-cv-history.service';
import { Candidate } from '../candidates/entities/candidate.entity';
import { CandidateCVHistory } from '../candidates/entities/candidate-cv-history.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Candidate, CandidateCVHistory]),
  ],
  controllers: [ResourcesController],
  providers: [UploadCandidateCVHandler, CandidateCVHistoryService],
})
export class ResourcesModule {}
