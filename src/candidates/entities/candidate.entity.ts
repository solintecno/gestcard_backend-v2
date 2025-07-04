import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Education } from './education.entity';
import { WorkExperience } from './work-experience.entity';
import { User } from '../../auth/entities/user.entity';
import { JobApplication } from '../../job-offers/entities/job-application.entity';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'jsonb', nullable: true })
  skills?: string[];

  // Relación uno a uno con User
  @OneToOne(() => User, (u) => u.candidate)
  user: User;

  // Historial laboral
  @OneToMany(
    () => WorkExperience,
    (workExperience) => workExperience.candidate,
    {
      cascade: true,
    },
  )
  workExperience: WorkExperience[];

  // Historial educativo
  @OneToMany(() => Education, (education) => education.candidate, {
    cascade: true,
  })
  educationHistory: Education[];

  // Aplicaciones a ofertas de trabajo
  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.candidate,
    {
      cascade: true,
    },
  )
  jobApplications: JobApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
