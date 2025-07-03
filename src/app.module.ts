import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities';
import { Skill } from './skills/entities';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432', 10),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Skill],
        synchronize: configService.get('NODE_ENV') === 'development',
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SkillsModule,
  ],
})
export class AppModule {}
