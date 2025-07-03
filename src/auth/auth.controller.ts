import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { GoogleAuthDto, LoginResponseDto, ErrorResponseDto } from './dto';
import { CreateGoogleUserCommand, LoginGoogleUserCommand } from './commands';

import { User } from './entities';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticación con Google',
    description:
      'Autentica al usuario usando Google Auth y devuelve un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    const startTime = Date.now();
    this.logger.log(
      `Google login request received for email: ${googleAuthDto.email}`,
    );

    try {
      // Intentar hacer login con el usuario existente
      try {
        const loginResult = await this.commandBus.execute<
          LoginGoogleUserCommand,
          { user: User; accessToken: string }
        >(new LoginGoogleUserCommand(googleAuthDto.email));

        const duration = Date.now() - startTime;
        this.logger.log(
          `Google login completed successfully for existing user: ${googleAuthDto.email} in ${duration}ms`,
        );

        return {
          message: 'Google login successful',
          ...loginResult,
        };
      } catch {
        // Si el usuario no existe, crearlo
        this.logger.log(
          `User not found, creating new Google user: ${googleAuthDto.email}`,
        );

        const newUser = await this.commandBus.execute<
          CreateGoogleUserCommand,
          User
        >(new CreateGoogleUserCommand(googleAuthDto));

        // Hacer login con el usuario recién creado
        const loginResult = await this.commandBus.execute<
          LoginGoogleUserCommand,
          { user: User; accessToken: string }
        >(new LoginGoogleUserCommand(newUser.email));

        const duration = Date.now() - startTime;
        this.logger.log(
          `Google user created and logged in successfully: ${googleAuthDto.email} in ${duration}ms`,
        );

        return {
          message: 'Google user created and logged in successfully',
          ...loginResult,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Google authentication failed for ${googleAuthDto.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
