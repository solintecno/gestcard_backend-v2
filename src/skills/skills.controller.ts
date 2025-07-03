import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateSkillDto,
  UpdateSkillDto,
  GetSkillsQueryDto,
  SkillResponseDto,
  PaginatedSkillsResponseDto,
} from './dto';
import {
  CreateSkillCommand,
  UpdateSkillCommand,
  DeleteSkillCommand,
} from './commands';
import { GetSkillsQuery } from './queries';
import { JwtAuthGuard, RolesGuard, Roles, Public } from '../security';
import { UserRole } from '../shared/enums';
import { ErrorResponseDto } from '../common';

@ApiTags('skills')
@Controller('skills')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SkillsController {
  private readonly logger = new Logger(SkillsController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Obtener lista paginada de skills',
    description: 'Retorna una lista paginada de skills con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de skills obtenida exitosamente',
    type: PaginatedSkillsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos',
    type: ErrorResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre de skill',
    example: 'JavaScript',
  })
  async getSkills(
    @Query() queryDto: GetSkillsQueryDto,
  ): Promise<PaginatedSkillsResponseDto> {
    this.logger.log('Getting skills list');
    return this.queryBus.execute(new GetSkillsQuery(queryDto));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Crear nueva skill',
    description: 'Crea una nueva skill en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Skill creada exitosamente',
    type: SkillResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ya existe una skill con ese nombre',
    type: ErrorResponseDto,
  })
  async createSkill(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    this.logger.log(`Creating skill: ${createSkillDto.name}`);
    return this.commandBus.execute(new CreateSkillCommand(createSkillDto));
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar skill',
    description: 'Actualiza una skill existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill actualizada exitosamente',
    type: SkillResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Skill no encontrada',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ya existe una skill con ese nombre',
    type: ErrorResponseDto,
  })
  async updateSkill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    this.logger.log(`Updating skill with ID: ${id}`);
    return this.commandBus.execute(new UpdateSkillCommand(id, updateSkillDto));
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar skill',
    description: 'Elimina una skill del sistema',
  })
  @ApiResponse({
    status: 204,
    description: 'Skill eliminada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Skill no encontrada',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
    type: ErrorResponseDto,
  })
  async deleteSkill(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Deleting skill with ID: ${id}`);
    return this.commandBus.execute(new DeleteSkillCommand(id));
  }
}
