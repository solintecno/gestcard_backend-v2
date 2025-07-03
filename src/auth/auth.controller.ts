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
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.commandBus.execute<
      ForgotPasswordCommand,
      { message: string }
    >(new ForgotPasswordCommand(forgotPasswordDto));
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.commandBus.execute<
      ResetPasswordCommand,
      { message: string }
    >(new ResetPasswordCommand(resetPasswordDto));
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
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
  adminOnly() {
    return {
      message: 'This endpoint is only accessible to admins',
    };
  }

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
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
