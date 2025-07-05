import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Candidate } from '../../candidates/entities/candidate.entity';
import { JobOffer } from './job-offer.entity';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'candidate_id', type: 'uuid' })
  candidateId: string;

  @Column({ name: 'job_offer_id', type: 'uuid' })
  jobOfferId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
    name: 'application_status',
  })
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

  @Column({ type: 'text', nullable: true, name: 'cover_letter' })
  coverLetter?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    name: 'applied_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  appliedAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  // Relación con Candidate
  @ManyToOne(() => Candidate, 'jobApplications', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  // Relación con JobOffer
  @ManyToOne(() => JobOffer, 'applications', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_offer_id' })
  jobOffer: JobOffer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
