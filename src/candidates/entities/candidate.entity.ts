import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Education } from './education.entity';
import { WorkExperience } from './work-experience.entity';
import { User } from '../../auth/entities/user.entity';
import { JobApplication } from '../../job-offers/entities/job-application.entity';
import { CandidateRating } from './candidate-rating.entity';
import { CandidateCVHistory } from './candidate-cv-history.entity';

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

  // Relación muchos a muchos con Skills
  @ManyToMany('Skill', 'candidates', {
    cascade: true,
  })
  @JoinTable({
    name: 'candidate_skills',
    joinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  skills: any[];

  // Relación uno a uno con User
  @OneToOne(() => User, (u) => u.candidate, {
    eager: true,
  })
  user: User;

  // Historial laboral
  @OneToMany(
    () => WorkExperience,
    (workExperience) => workExperience.candidate,
    {
      cascade: true,
    },
  )
  workExperience?: WorkExperience[];

  // Historial educativo
  @OneToMany(() => Education, (education) => education.candidate, {
    cascade: true,
  })
  educationHistory?: Education[];

  // Aplicaciones a ofertas de trabajo
  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.candidate,
    {
      cascade: true,
    },
  )
  jobApplications?: JobApplication[];

  // Historial de valoraciones
  @OneToMany(() => CandidateRating, (rating) => rating.candidate, {
    cascade: true,
    eager: true,
  })
  ratings?: CandidateRating[];

  // Historial de CVs
  @OneToMany(() => CandidateCVHistory, (cvHistory) => cvHistory.candidate)
  cvHistory: CandidateCVHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
