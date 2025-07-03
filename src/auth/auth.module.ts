import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { User } from './entities';
import { JwtStrategy } from './strategies';
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
  providers: [JwtStrategy, ...CommandHandlers],
  exports: [JwtModule, PassportModule, TypeOrmModule],
})
export class AuthModule {}
