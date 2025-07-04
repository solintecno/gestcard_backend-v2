import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserRole } from '../../shared/enums';
import { GetAdminsQuery } from '../queries/get-admins.query';
import { PaginatedAdminsResponseDto, AdminResponseDto } from '../dto';

@QueryHandler(GetAdminsQuery)
export class GetAdminsHandler implements IQueryHandler<GetAdminsQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetAdminsQuery): Promise<PaginatedAdminsResponseDto> {
    const { isActive, search, page, limit } = query;

    const queryBuilder: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.candidate', 'candidate')
      .where('user.role = :role', { role: UserRole.ADMIN });

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere('user.email ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data: AdminResponseDto[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      profilePicture: user.profilePicture,
      candidateName: user.candidate ? 'Associated Candidate' : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
