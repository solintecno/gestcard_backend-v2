import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CandidatesController } from './candidates.controller';
import { Candidate, Education, WorkExperience } from './entities';
import {
  CreateCandidateHandler,
  UpdateCandidateHandler,
  DeleteCandidateHandler,
  GetCandidateByIdHandler,
  GetCandidatesHandler,
  CreateEducationHandler,
  UpdateEducationHandler,
  DeleteEducationHandler,
  CreateWorkExperienceHandler,
  UpdateWorkExperienceHandler,
  DeleteWorkExperienceHandler,
  GetCandidateWorkExperienceHandler,
  GetCandidateEducationHistoryHandler,
} from './handlers';

const CommandHandlers = [
  CreateCandidateHandler,
  UpdateCandidateHandler,
  DeleteCandidateHandler,
  CreateEducationHandler,
  UpdateEducationHandler,
  DeleteEducationHandler,
  CreateWorkExperienceHandler,
  UpdateWorkExperienceHandler,
  DeleteWorkExperienceHandler,
];

const QueryHandlers = [
  GetCandidateByIdHandler,
  GetCandidatesHandler,
  GetCandidateWorkExperienceHandler,
  GetCandidateEducationHistoryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate, Education, WorkExperience]),
    CqrsModule,
  ],
  controllers: [CandidatesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CandidatesModule {}
