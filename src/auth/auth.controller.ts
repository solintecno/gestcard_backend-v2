import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
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
  ProfileResponseDto,
  ErrorResponseDto,
} from './dto';
import {
  RegisterUserCommand,
  LoginUserCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
} from './commands';
import { GetUserByIdQuery } from './queries';
import { LocalAuthGuard, JwtAuthGuard, RolesGuard } from './guards';
import { GetUser, Roles } from './decorators';
import { User } from './entities';
import { UserRole } from '../shared/enums';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
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
    const user = await this.commandBus.execute<RegisterUserCommand, User>(
      new RegisterUserCommand(registerDto),
    );

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
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
    const result = await this.commandBus.execute<
      LoginUserCommand,
      { user: User; accessToken: string }
    >(new LoginUserCommand(loginDto));
    return {
      message: 'Login successful',
      ...result,
    };
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
    return await this.commandBus.execute<
      ForgotPasswordCommand,
      { message: string }
    >(new ForgotPasswordCommand(forgotPasswordDto));
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
    return await this.commandBus.execute<
      ResetPasswordCommand,
      { message: string }
    >(new ResetPasswordCommand(resetPasswordDto));
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Devuelve la información del perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  getProfile(@GetUser() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Endpoint exclusivo para administradores',
    description:
      'Endpoint de prueba accesible solo para usuarios con rol de administrador',
  })
  @ApiResponse({
    status: 200,
    description: 'Acceso autorizado',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Acceso denegado - Se requiere rol de administrador',
    type: ErrorResponseDto,
  })
  adminOnly() {
    return {
      message: 'This endpoint is only accessible to admins',
    };
  }

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener información detallada del usuario',
    description:
      'Obtiene información completa del usuario autenticado desde la base de datos',
  })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido o expirado',
    type: ErrorResponseDto,
  })
  async getUserInfo(@GetUser() user: User) {
    const userInfo = await this.queryBus.execute<GetUserByIdQuery, User | null>(
      new GetUserByIdQuery(user.id),
    );
    if (userInfo) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userInfo;
      return { user: userWithoutPassword };
    }
    return { user: null };
  }
}
