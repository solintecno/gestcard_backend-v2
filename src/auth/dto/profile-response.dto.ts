import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Datos del perfil del usuario',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
