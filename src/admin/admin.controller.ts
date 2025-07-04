import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../security/guards';
import { Roles } from '../security/decorators';
import { UserRole } from '../shared/enums';
import {
  GetAdminsQueryDto,
  UpdateAdminStatusDto,
  PromoteToAdminDto,
  PaginatedAdminsResponseDto,
} from './dto';
import { GetAdminsQuery } from './queries';
import { UpdateAdminStatusCommand, PromoteToAdminCommand } from './commands';

@ApiTags('Admin Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({
    status: 200,
    description: 'List of admin users',
    type: PaginatedAdminsResponseDto,
  })
  async getAdmins(
    @Query() query: GetAdminsQueryDto,
  ): Promise<PaginatedAdminsResponseDto> {
    const { isActive, search, page = 1, limit = 10 } = query;

    return this.queryBus.execute(
      new GetAdminsQuery(isActive, search, page, limit),
    );
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update admin status (activate/deactivate)' })
  @ApiResponse({
    status: 200,
    description: 'Admin status updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateAdminStatus(
    @Param('id') adminId: string,
    @Body() updateStatusDto: UpdateAdminStatusDto,
  ): Promise<{ message: string }> {
    await this.commandBus.execute(
      new UpdateAdminStatusCommand(adminId, updateStatusDto.isActive),
    );

    return {
      message: `Admin ${updateStatusDto.isActive ? 'activated' : 'deactivated'} successfully`,
    };
  }

  @Post('promote')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Promote a user to admin' })
  @ApiResponse({
    status: 200,
    description: 'User promoted to admin successfully',
  })
  @HttpCode(HttpStatus.OK)
  async promoteToAdmin(
    @Body() promoteDto: PromoteToAdminDto,
  ): Promise<{ message: string }> {
    await this.commandBus.execute(new PromoteToAdminCommand(promoteDto.userId));

    return {
      message: 'User promoted to admin successfully',
    };
  }
}
