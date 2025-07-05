import { ApiProperty } from '@nestjs/swagger';

export class SkillResponseDto {
  @ApiProperty({
    description: 'ID único de la skill',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la skill',
    example: 'JavaScript',
  })
  name: string;
}
