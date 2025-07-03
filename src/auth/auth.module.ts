import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { User } from './entities';
import { SecurityModule } from '../security';
import {
  CreateGoogleUserHandler,
  LoginGoogleUserHandler,
  GetUserByIdHandler,
} from './handlers';

const CommandHandlers = [
  CreateGoogleUserHandler,
  LoginGoogleUserHandler,
  GetUserByIdHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([User]), SecurityModule, CqrsModule],
  controllers: [AuthController],
  providers: [...CommandHandlers],
  exports: [TypeOrmModule, SecurityModule],
})
export class AuthModule {}
