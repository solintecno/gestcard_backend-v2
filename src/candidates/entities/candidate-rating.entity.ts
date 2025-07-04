import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('candidate_ratings')
export class CandidateRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number; // Puntuación del 1.00 al 5.00

  @Column({ type: 'text', nullable: true })
  comment?: string; // Comentario opcional sobre la valoración

  @Column({ name: 'rating_category', nullable: true })
  ratingCategory?: string; // Categoría de la valoración (ej: 'technical_skills', 'communication', 'overall')

  @Column({ name: 'context_type', nullable: true })
  contextType?: string; // Contexto de la valoración (ej: 'interview', 'project', 'general')

  @Column({ name: 'context_reference', nullable: true })
  contextReference?: string; // Referencia al contexto (ej: ID de entrevista, proyecto, etc.)

  // Relación muchos a uno con Candidate
  @ManyToOne(() => Candidate, (candidate) => candidate.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @Column({ name: 'candidate_id' })
  candidateId: string;

  // Relación muchos a uno con User (quien hace la valoración)
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'rated_by' })
  ratedBy?: User;

  @Column({ name: 'rated_by', nullable: true })
  ratedById?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
