import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities';
import { Skill } from './skills/entities';
import { JobApplication, JobOffer } from './job-offers/entities';
import {
  Candidate,
  CandidateRating,
  Education,
  WorkExperience,
} from './candidates/entities';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';
import { JobOffersModule } from './job-offers/job-offers.module';
import { CandidatesModule } from './candidates/candidates.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432', 10),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User,
          Skill,
          JobOffer,
          JobApplication,
          Candidate,
          Education,
          WorkExperience,
          CandidateRating,
        ],
        synchronize: true,
        //logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    SkillsModule,
    JobOffersModule,
    CandidatesModule,
    AdminModule,
  ],
})
export class AppModule {}
