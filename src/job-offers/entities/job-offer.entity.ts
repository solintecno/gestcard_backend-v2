import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../auth/entities';
import { JobApplication } from './job-application.entity';
import { Skill } from '../../skills/entities';
import {
  EmploymentType,
  JobOfferStatus,
  WorkModality,
} from '../../shared/enums';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary?: number;

  @Column({ type: 'varchar', length: 20, default: EmploymentType.FULL_TIME })
  employmentType: EmploymentType;

  @Column({ type: 'varchar', length: 20, default: WorkModality.ON_SITE })
  workModality: WorkModality;

  @Column({ type: 'varchar', length: 20, default: JobOfferStatus.ACTIVE })
  status: JobOfferStatus;

  @Column({ type: 'text', array: true, default: [] })
  requirements: string[];

  @Column({ type: 'text', array: true, default: [] })
  benefits: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  experienceLevel?: string;

  @Column({ type: 'date', nullable: true })
  applicationDeadline?: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  // Habilidades requeridas para esta oferta
  @ManyToMany(() => Skill, { cascade: true })
  @JoinTable({
    name: 'job_offer_skills',
    joinColumn: {
      name: 'job_offer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  skills: Skill[];

  // Aplicaciones de candidatos a esta oferta
  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.jobOffer,
    {
      cascade: true,
    },
  )
  applications: JobApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
