import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsUrl } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'URL de la foto de perfil',
    example: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
  })
  @IsUrl()
  @IsNotEmpty()
  readonly picture: string;
}
