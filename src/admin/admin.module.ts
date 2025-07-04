import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './admin.controller';
import { User } from '../auth/entities/user.entity';
import {
  GetAdminsHandler,
  UpdateAdminStatusHandler,
  PromoteToAdminHandler,
} from './handlers';

const CommandHandlers = [UpdateAdminStatusHandler, PromoteToAdminHandler];
const QueryHandlers = [GetAdminsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [AdminController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class AdminModule {}
