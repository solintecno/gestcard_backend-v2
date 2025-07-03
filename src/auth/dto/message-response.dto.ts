import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Operation completed successfully',
  })
  message: string;
}
