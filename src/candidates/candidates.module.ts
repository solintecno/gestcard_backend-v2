import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CandidatesController } from './candidates.controller';
import {
  Candidate,
  Education,
  WorkExperience,
  CandidateCVHistory,
} from './entities';
import { User } from '../auth/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { JobOffer, JobApplication } from '../job-offers/entities';
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
  CreateFullCandidateHandler,
  GetFullCandidateByIdHandler,
  ApplyToJobOfferHandler,
  GetCandidateJobApplicationsHandler,
  GetCandidateCVHistoryHandler, // <-- Add this import
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
  CreateFullCandidateHandler,
  ApplyToJobOfferHandler,
];

export const QueryHandlers = [
  GetCandidateByIdHandler,
  GetCandidatesHandler,
  GetCandidateWorkExperienceHandler,
  GetCandidateEducationHistoryHandler,
  GetFullCandidateByIdHandler,
  GetCandidateJobApplicationsHandler,
  GetCandidateCVHistoryHandler, // <-- Add handler here
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidate,
      Education,
      WorkExperience,
      CandidateCVHistory,
      User,
      Skill, // <-- Agregado aquí
      JobOffer, // <-- Necesario para el handler de aplicar a oferta
      JobApplication, // <-- Necesario para el handler de aplicar a oferta
    ]),
    CqrsModule,
  ],
  controllers: [CandidatesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CandidatesModule {}
