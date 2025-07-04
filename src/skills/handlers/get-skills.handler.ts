import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { GetSkillsQuery } from '../queries';
import { Skill } from '../entities';
import { PaginatedSkillsResponseDto } from '../dto';

@QueryHandler(GetSkillsQuery)
export class GetSkillsHandler implements IQueryHandler<GetSkillsQuery> {
  private readonly logger = new Logger(GetSkillsHandler.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async execute(query: GetSkillsQuery): Promise<PaginatedSkillsResponseDto> {
    const { queryDto } = query;
    const { page = 1, limit = 10, search } = queryDto;

    this.logger.log(
      `Getting skills - Page: ${page}, Limit: ${limit}, Search: ${search || 'none'}`,
    );

    const queryBuilder = this.skillRepository.createQueryBuilder('skill');

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere('skill.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Ordenar por fecha de creación (más recientes primero)
    queryBuilder.orderBy('skill.createdAt', 'DESC');

    // Calcular offset
    const offset = (page - 1) * limit;

    // Obtener total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    const skills = await queryBuilder.skip(offset).take(limit).getMany();

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    this.logger.log(`Found ${skills.length} skills out of ${total} total`);

    return {
      data: skills,
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
}
