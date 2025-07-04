import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { JobOffersController } from './job-offers.controller';
import { JobOffer } from './entities';
import { Skill } from '../skills/entities';
import {
  CreateJobOfferHandler,
  UpdateJobOfferHandler,
  DeleteJobOfferHandler,
  GetJobOffersHandler,
  GetJobOfferByIdHandler,
} from './handlers';

const CommandHandlers = [
  CreateJobOfferHandler,
  UpdateJobOfferHandler,
  DeleteJobOfferHandler,
];

const QueryHandlers = [GetJobOffersHandler, GetJobOfferByIdHandler];

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer, Skill]), CqrsModule],
  controllers: [JobOffersController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [...CommandHandlers, ...QueryHandlers],
})
export class JobOffersModule {}
