import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ApplyToJobOfferDto {
  @ApiProperty({
    description: 'ID de la oferta de trabajo a la que se aplica',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  jobOfferId: string;
}
