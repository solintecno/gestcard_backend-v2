import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCandidatesQuery } from '../queries';
import { Candidate } from '../entities';
import { PaginatedCandidatesResponseDto, CandidateResponseDto } from '../dto';

@QueryHandler(GetCandidatesQuery)
export class GetCandidatesHandler implements IQueryHandler<GetCandidatesQuery> {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async execute(
    query: GetCandidatesQuery,
  ): Promise<PaginatedCandidatesResponseDto> {
    const {
      page = 1,
      limit = 10,
      skills = false,
      workExperience = false,
      education = false,
      skillsFilter,
    } = query.query;

    // Construir relaciones dinámicamente
    const relations = ['user'];
    if (skills) relations.push('skills');
    if (workExperience) relations.push('workExperience');
    if (education) relations.push('educationHistory');

    let candidates: Candidate[] = [];
    let total = 0;

    if (skillsFilter) {
      const skillNames = skillsFilter
        .split(',')
        .map((name: string) => name.trim());
      const qb = this.candidateRepository
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.user', 'user');
      if (skills) {
        qb.leftJoinAndSelect('candidate.skills', 'skills');
      }
      if (workExperience) {
        qb.leftJoinAndSelect('candidate.workExperience', 'workExperience');
      }
      if (education) {
        qb.leftJoinAndSelect('candidate.educationHistory', 'educationHistory');
      }
      qb.innerJoin(
        'candidate.skills',
        'filterSkill',
        'filterSkill.name IN (:...skillNames)',
        { skillNames },
      );
      qb.skip((page - 1) * limit)
        .take(limit)
        .orderBy('candidate.createdAt', 'DESC');
      candidates = await qb.getMany();
      total = await qb.getCount();
    } else {
      [candidates, total] = await this.candidateRepository.findAndCount({
        relations,
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: candidates.map((candidate) =>
        this.mapToResponseDto(candidate, { skills, workExperience, education }),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  private mapToResponseDto(
    candidate: Candidate,
    opts?: { skills?: boolean; workExperience?: boolean; education?: boolean },
  ): CandidateResponseDto {
    const dto: CandidateResponseDto = {
      id: candidate.id,
      name: candidate.user?.name,
      email: candidate.user?.email,
      profilePicture: candidate.user?.profilePicture,
      phone: candidate.phone,
      address: candidate.address,
      dateOfBirth: candidate.dateOfBirth,
      summary: candidate.summary,
      rating:
        candidate.ratings && candidate.ratings.length > 0
          ? candidate.ratings.reduce((acc, val) => acc + val.rating, 0) /
            candidate.ratings.length
          : 0,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
    if (opts?.skills === true) dto.skills = candidate.skills;
    if (opts?.workExperience === true) {
      dto.workExperience = candidate.workExperience?.map((w) => ({
        id: w.id,
        company: w.company,
        position: w.position,
        startDate:
          w.startDate instanceof Date ? w.startDate.toISOString() : w.startDate,
        endDate:
          w.endDate instanceof Date ? w.endDate.toISOString() : w.endDate,
        description: w.description,
        location: w.location,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      }));
    }
    if (opts?.education === true) {
      dto.educationHistory = candidate.educationHistory?.map((e) => ({
        id: e.id,
        institution: e.institution,
        field: e.field,
        startDate: e.startDate,
        endDate: e.endDate,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }));
    }
    return dto;
  }
}
