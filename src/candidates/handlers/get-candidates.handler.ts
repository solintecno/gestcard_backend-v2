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

    const queryBuilder = this.candidateRepository
      .createQueryBuilder('candidate')
      .leftJoinAndSelect('candidate.user', 'user')
      .orderBy('candidate.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (skills) {
      queryBuilder.leftJoinAndSelect('candidate.skills', 'skills');
    }
    if (workExperience) {
      queryBuilder.leftJoinAndSelect(
        'candidate.workExperience',
        'workExperience',
      );
    }
    if (education) {
      queryBuilder.leftJoinAndSelect(
        'candidate.educationHistory',
        'educationHistory',
      );
    }
    if (skillsFilter?.length) {
      queryBuilder
        .leftJoin('candidate.skills', 'filterSkill')
        .andWhere('filterSkill.name IN (:...skillNames)', {
          skillNames: skillsFilter,
        });
    }

    const [candidates, total] = await queryBuilder.getManyAndCount();

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
