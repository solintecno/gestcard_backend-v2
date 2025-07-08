import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateFullCandidateCommand } from '../commands/create-full-candidate.command';
import { Candidate, Education, WorkExperience } from '../entities';
import { CandidateResponseDto } from '../dto';
import { User } from '../../auth/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';

@CommandHandler(CreateFullCandidateCommand)
export class CreateFullCandidateHandler
  implements ICommandHandler<CreateFullCandidateCommand>
{
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(
    command: CreateFullCandidateCommand,
  ): Promise<CandidateResponseDto> {
    const { userId, createFullCandidateDto } = command;

    // 1. Buscar el usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidate'],
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // Skills
    let skills: Skill[] = [];
    if (createFullCandidateDto.skills?.length) {
      skills = await this.skillRepository.findByIds(
        createFullCandidateDto.skills,
      );
    }
    // 2. Buscar o crear el candidato y asociar al usuario
    let candidate = await this.candidateRepository.findOne({
      where: { user: { id: userId } },
    });
    if (candidate) {
      // Actualizar datos básicos
      candidate.phone = createFullCandidateDto.phone;
      candidate.address = createFullCandidateDto.location;
      candidate.summary = createFullCandidateDto.summary;
      // ...otros campos si los hay
      candidate.skills = skills; // Reemplaza las skills anteriores por las nuevas
      candidate = await this.candidateRepository.save(candidate);
      // Eliminar historiales previos
      await this.educationRepository.delete({
        candidate: { id: candidate.id },
      });
      await this.workExperienceRepository.delete({
        candidate: { id: candidate.id },
      });
    } else {
      candidate = this.candidateRepository.create({
        id: userId,
        phone: createFullCandidateDto.phone,
        address: createFullCandidateDto.location,
        summary: createFullCandidateDto.summary,
        user: user,
        skills: skills,
      });
      candidate = await this.candidateRepository.save(candidate);
    }

    // 3. Crear historial educativo
    if (createFullCandidateDto.education?.length) {
      for (const edu of createFullCandidateDto.education) {
        const education = this.educationRepository.create({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          candidate: candidate,
        });
        await this.educationRepository.save(education);
      }
    }

    // 4. Crear historial laboral
    if (createFullCandidateDto.workExperience?.length) {
      for (const work of createFullCandidateDto.workExperience) {
        const workExp = this.workExperienceRepository.create({
          ...work,
          startDate: new Date(work.startDate),
          endDate: work.endDate ? new Date(work.endDate) : undefined,
          candidate: candidate,
        });
        await this.workExperienceRepository.save(workExp);
      }
    }

    // 5. Retornar el candidato creado/actualizado
    return {
      id: candidate.id,
      phone: candidate.phone,
      address: candidate.address,
      dateOfBirth: candidate.dateOfBirth,
      summary: candidate.summary,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
