import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Nombre de la skill',
    example: 'JavaScript',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;
}
