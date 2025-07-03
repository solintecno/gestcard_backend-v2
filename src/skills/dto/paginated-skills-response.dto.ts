import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from './skill-response.dto';

export class PaginatedSkillsResponseDto {
  @ApiProperty({
    description: 'Lista de skills',
    type: [SkillResponseDto],
  })
  data: SkillResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
