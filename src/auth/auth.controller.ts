import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RegisterResponseDto,
  LoginResponseDto,
  MessageResponseDto,
  ErrorResponseDto,
} from './dto';
import {
  RegisterUserCommand,
  LoginUserCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
} from './commands';

import { LocalAuthGuard } from './guards';

import { User } from './entities';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email ya existe en el sistema',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    const startTime = Date.now();
    this.logger.log(
      `Registration request received for email: ${registerDto.email}`,
    );

    try {
      const user = await this.commandBus.execute<RegisterUserCommand, User>(
        new RegisterUserCommand(registerDto),
      );

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      const duration = Date.now() - startTime;
      this.logger.log(
        `Registration completed successfully for: ${user.email} in ${duration}ms`,
      );

      return {
        message: 'User registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Registration failed for ${registerDto.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario y devuelve un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas o cuenta desactivada',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    const startTime = Date.now();
    this.logger.log(`Login request received for email: ${loginDto.email}`);

    try {
      const result = await this.commandBus.execute<
        LoginUserCommand,
        { user: User; accessToken: string }
      >(new LoginUserCommand(loginDto));

      const duration = Date.now() - startTime;
      this.logger.log(
        `Login completed successfully for: ${loginDto.email} in ${duration}ms`,
      );

      return {
        message: 'Login successful',
        ...result,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Login failed for ${loginDto.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description:
      'Inicia el proceso de recuperación de contraseña enviando un token al email',
  })
  @ApiResponse({
    status: 200,
    description: 'Instrucciones de recuperación enviadas',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email inválido',
    type: ErrorResponseDto,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const startTime = Date.now();
    this.logger.log(
      `Forgot password request received for email: ${forgotPasswordDto.email}`,
    );

    try {
      const result = await this.commandBus.execute<
        ForgotPasswordCommand,
        { message: string }
      >(new ForgotPasswordCommand(forgotPasswordDto));

      const duration = Date.now() - startTime;
      this.logger.log(
        `Forgot password request completed for: ${forgotPasswordDto.email} in ${duration}ms`,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Forgot password request failed for ${forgotPasswordDto.email} after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description:
      'Restablece la contraseña usando un token de recuperación válido',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const startTime = Date.now();
    this.logger.log(
      `Reset password request received with token: ${resetPasswordDto.token.substring(0, 8)}...`,
    );

    try {
      const result = await this.commandBus.execute<
        ResetPasswordCommand,
        { message: string }
      >(new ResetPasswordCommand(resetPasswordDto));

      const duration = Date.now() - startTime;
      this.logger.log(`Reset password completed successfully in ${duration}ms`);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Reset password failed after ${duration}ms: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
