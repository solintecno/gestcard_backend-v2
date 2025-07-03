import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { User } from './entities';
import { LocalStrategy, JwtStrategy } from './strategies';
import {
  RegisterUserHandler,
  LoginUserHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  GetUserByIdHandler,
  GetUserByEmailHandler,
  ValidateUserHandler,
} from './handlers';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
];

const QueryHandlers = [
  GetUserByIdHandler,
  GetUserByEmailHandler,
  ValidateUserHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  exports: [JwtModule, PassportModule, TypeOrmModule],
})
export class AuthModule {}
