import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { TokenService } from './services';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard, RolesGuard } from './guards';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    CqrsModule,
  ],
  providers: [TokenService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [TokenService, JwtModule, PassportModule, JwtAuthGuard, RolesGuard],
})
export class SecurityModule {}
