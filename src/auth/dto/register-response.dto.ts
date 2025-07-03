import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Datos del usuario registrado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
