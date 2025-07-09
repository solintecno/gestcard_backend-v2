import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity('candidate_cv_history')
export class CandidateCVHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.cvHistory, {
    nullable: false,
  })
  candidate: Candidate;

  @Column({ type: 'varchar', length: 512 })
  cvPath: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
