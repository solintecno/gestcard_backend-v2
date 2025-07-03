import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Bad Request',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta donde ocurrió el error',
    example: '/auth/login',
  })
  path: string;
}
