import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { JobOffer } from '../../job-offers/entities';
import { Candidate } from 'src/candidates';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  // Ofertas de trabajo que requieren esta habilidad
  @ManyToMany(() => JobOffer, (jobOffer) => jobOffer.skills)
  jobOffers: JobOffer[];

  // Candidatos que tienen esta habilidad
  @ManyToMany('Candidate', 'skills')
  candidates: Candidate[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
