import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CandidatesController } from './candidates.controller';
import { Candidate, Education, WorkExperience } from './entities';
import { User } from '../auth/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
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
];

export const QueryHandlers = [
  GetCandidateByIdHandler,
  GetCandidatesHandler,
  GetCandidateWorkExperienceHandler,
  GetCandidateEducationHistoryHandler,
  GetFullCandidateByIdHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidate,
      Education,
      WorkExperience,
      User,
      Skill, // <-- Agregado aquí
    ]),
    CqrsModule,
  ],
  controllers: [CandidatesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CandidatesModule {}
