import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Education } from './education.entity';

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

  // Historial laboral
  @Column({ type: 'jsonb', nullable: true, name: 'work_experience' })
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
  }>;

  // Historial educativo
  @OneToMany(() => Education, (education) => education.candidate, {
    cascade: true,
  })
  educationHistory: Education[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
