import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { Skill } from './entities';
import {
  CreateSkillHandler,
  UpdateSkillHandler,
  DeleteSkillHandler,
  GetSkillsHandler,
} from './handlers';

const CommandHandlers = [
  CreateSkillHandler,
  UpdateSkillHandler,
  DeleteSkillHandler,
];

const QueryHandlers = [GetSkillsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Skill])],
  controllers: [SkillsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class SkillsModule {}
