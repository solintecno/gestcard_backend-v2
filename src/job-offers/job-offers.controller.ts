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
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateJobOfferDto,
  UpdateJobOfferDto,
  GetJobOffersQueryDto,
  JobOfferResponseDto,
  PaginatedJobOffersResponseDto,
} from './dto';
import {
  CreateJobOfferCommand,
  UpdateJobOfferCommand,
  DeleteJobOfferCommand,
} from './commands';
import { GetJobOffersQuery, GetJobOfferByIdQuery } from './queries';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  Public,
  CurrentUser,
} from '../security';
import { UserRole } from '../shared/enums';
import { ErrorResponseDto } from '../common';

@ApiTags('job-offers')
@Controller('job-offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class JobOffersController {
  private readonly logger = new Logger(JobOffersController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todas las ofertas de trabajo paginadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas de trabajo obtenida exitosamente',
    type: PaginatedJobOffersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de consulta inválidos',
    type: ErrorResponseDto,
  })
  async getJobOffers(
    @Query() queryDto: GetJobOffersQueryDto,
  ): Promise<PaginatedJobOffersResponseDto> {
    this.logger.log(
      `Getting job offers - Page: ${queryDto.page}, Limit: ${queryDto.limit}`,
    );

    const query = new GetJobOffersQuery(
      queryDto.page,
      queryDto.limit,
      queryDto.search,
      queryDto.location,
      queryDto.company,
      queryDto.employmentType,
      queryDto.status,
      queryDto.minSalary,
      queryDto.maxSalary,
    );

    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener una oferta de trabajo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Oferta de trabajo obtenida exitosamente',
    type: JobOfferResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Oferta de trabajo no encontrada',
    type: ErrorResponseDto,
  })
  async getJobOfferById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobOfferResponseDto> {
    this.logger.log(`Getting job offer with ID: ${id}`);

    const query = new GetJobOfferByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva oferta de trabajo' })
  @ApiResponse({
    status: 201,
    description: 'Oferta de trabajo creada exitosamente',
    type: JobOfferResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Error al crear la oferta de trabajo',
    type: ErrorResponseDto,
  })
  async createJobOffer(
    @Body() createJobOfferDto: CreateJobOfferDto,
    @CurrentUser() user: { id: string },
  ): Promise<JobOfferResponseDto> {
    this.logger.log(
      `Creating job offer with title: ${createJobOfferDto.title}`,
    );

    const command = new CreateJobOfferCommand(
      createJobOfferDto.title,
      createJobOfferDto.description,
      createJobOfferDto.company,
      createJobOfferDto.location,
      user.id,
      createJobOfferDto.salary,
      createJobOfferDto.employmentType,
      createJobOfferDto.status,
      createJobOfferDto.requirements,
      createJobOfferDto.benefits,
      createJobOfferDto.experienceLevel,
      createJobOfferDto.applicationDeadline
        ? new Date(createJobOfferDto.applicationDeadline)
        : undefined,
    );

    return this.commandBus.execute(command);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una oferta de trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Oferta de trabajo actualizada exitosamente',
    type: JobOfferResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Oferta de trabajo no encontrada',
    type: ErrorResponseDto,
  })
  async updateJobOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOfferResponseDto> {
    this.logger.log(`Updating job offer with ID: ${id}`);

    const command = new UpdateJobOfferCommand(
      id,
      updateJobOfferDto.title,
      updateJobOfferDto.description,
      updateJobOfferDto.company,
      updateJobOfferDto.location,
      updateJobOfferDto.salary,
      updateJobOfferDto.employmentType,
      updateJobOfferDto.status,
      updateJobOfferDto.requirements,
      updateJobOfferDto.benefits,
      updateJobOfferDto.experienceLevel,
      updateJobOfferDto.applicationDeadline
        ? new Date(updateJobOfferDto.applicationDeadline)
        : undefined,
    );

    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una oferta de trabajo' })
  @ApiResponse({
    status: 204,
    description: 'Oferta de trabajo eliminada exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Oferta de trabajo no encontrada',
    type: ErrorResponseDto,
  })
  async deleteJobOffer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Deleting job offer with ID: ${id}`);

    const command = new DeleteJobOfferCommand(id);
    return this.commandBus.execute(command);
  }
}
