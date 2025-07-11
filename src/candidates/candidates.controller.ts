import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../security/guards';
import { CurrentUser, Public } from '../security/decorators';
import { User } from '../auth/entities';
import {
  CreateCandidateDto,
  UpdateCandidateDto,
  CandidateResponseDto,
  GetCandidatesQueryDto,
  PaginatedCandidatesResponseDto,
  CreateEducationDto,
  UpdateEducationDto,
  EducationResponseDto,
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
  WorkExperienceResponseDto,
  CreateFullCandidateDto, // importado correctamente
  ApplyToJobOfferDto, // nuevo DTO para aplicar a oferta
} from './dto';
import {
  CreateCandidateCommand,
  UpdateCandidateCommand,
  DeleteCandidateCommand,
  CreateEducationCommand,
  UpdateEducationCommand,
  DeleteEducationCommand,
  CreateWorkExperienceCommand,
  UpdateWorkExperienceCommand,
  DeleteWorkExperienceCommand,
  CreateFullCandidateCommand, // importado correctamente
  ApplyToJobOfferCommand, // nuevo comando para aplicar a oferta
} from './commands';
import {
  GetCandidateByIdQuery,
  GetCandidatesQuery,
  GetCandidateWorkExperienceQuery,
  GetCandidateEducationHistoryQuery,
  GetFullCandidateByIdQuery,
  GetCandidateCVHistoryQuery,
  GetCandidateJobApplicationsQuery,
} from './queries';
import { CandidateCVHistory } from './entities/candidate-cv-history.entity';
import { PaginatedJobApplicationsResponseDto } from 'src/job-offers/dto/paginated-job-applications-response.dto';

@ApiTags('candidates')
@Controller('candidates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CandidatesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({
    status: 201,
    description: 'Candidate created successfully',
    type: CandidateResponseDto,
  })
  async createCandidate(
    @Body() createCandidateDto: CreateCandidateDto,
    @CurrentUser() user: User, // Assuming you want to associate the candidate with the current user
  ): Promise<CandidateResponseDto> {
    return this.commandBus.execute(
      new CreateCandidateCommand(createCandidateDto, user.id),
    );
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all candidates' })
  @ApiResponse({
    status: 200,
    description: 'List of candidates',
    type: PaginatedCandidatesResponseDto,
  })
  async getCandidates(
    @Query() query: GetCandidatesQueryDto,
  ): Promise<PaginatedCandidatesResponseDto> {
    return this.queryBus.execute(new GetCandidatesQuery(query));
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get candidate by ID' })
  @ApiResponse({
    status: 200,
    description: 'Candidate found',
    type: CandidateResponseDto,
  })
  async getCandidateById(
    @Param('id') id: string,
  ): Promise<CandidateResponseDto> {
    return this.queryBus.execute(new GetCandidateByIdQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update candidate' })
  @ApiResponse({
    status: 200,
    description: 'Candidate updated successfully',
    type: CandidateResponseDto,
  })
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ): Promise<CandidateResponseDto> {
    return this.commandBus.execute(
      new UpdateCandidateCommand(id, updateCandidateDto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete candidate' })
  @ApiResponse({
    status: 204,
    description: 'Candidate deleted successfully',
  })
  async deleteCandidate(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteCandidateCommand(id));
  }

  // Education endpoints
  @Get('education-history')
  @Public()
  @ApiOperation({ summary: 'Get candidate education history' })
  @ApiResponse({
    status: 200,
    description: 'Candidate education history list',
    type: [EducationResponseDto],
  })
  async getCandidateEducationHistory(
    @CurrentUser() user: User,
  ): Promise<EducationResponseDto[]> {
    return this.queryBus.execute(
      new GetCandidateEducationHistoryQuery(user.id),
    );
  }
  @Post('education')
  @ApiOperation({ summary: 'Add education to candidate' })
  @ApiResponse({
    status: 201,
    description: 'Education added successfully',
    type: EducationResponseDto,
  })
  async addEducation(
    @CurrentUser() user: User,
    @Body() createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.commandBus.execute(
      new CreateEducationCommand(user.id, createEducationDto),
    );
  }

  @Put('education/:educationId')
  @ApiOperation({ summary: 'Update education' })
  @ApiResponse({
    status: 200,
    description: 'Education updated successfully',
    type: EducationResponseDto,
  })
  async updateEducation(
    @CurrentUser() user: User,
    @Param('educationId') educationId: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.commandBus.execute(
      new UpdateEducationCommand(user.id, educationId, updateEducationDto),
    );
  }

  @Delete('education/:educationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete education' })
  @ApiResponse({
    status: 204,
    description: 'Education deleted successfully',
  })
  async deleteEducation(
    @CurrentUser() user: User,
    @Param('educationId') educationId: string,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteEducationCommand(user.id, educationId),
    );
  }

  // Get candidate work experience and education history
  @Get('/work-experience')
  @Public()
  @ApiOperation({ summary: 'Get candidate work experience' })
  @ApiResponse({
    status: 200,
    description: 'Candidate work experience list',
    type: [WorkExperienceResponseDto],
  })
  async getCandidateWorkExperience(
    @CurrentUser() user: User,
  ): Promise<WorkExperienceResponseDto[]> {
    return this.queryBus.execute(new GetCandidateWorkExperienceQuery(user.id));
  }

  // Work Experience endpoints
  @Post('work-experience')
  @ApiOperation({ summary: 'Add work experience to candidate' })
  @ApiResponse({
    status: 201,
    description: 'Work experience added successfully',
    type: WorkExperienceResponseDto,
  })
  async addWorkExperience(
    @CurrentUser() user: User,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    return this.commandBus.execute(
      new CreateWorkExperienceCommand(user.id, createWorkExperienceDto),
    );
  }

  @Put('work-experience/:workExperienceId')
  @ApiOperation({ summary: 'Update work experience' })
  @ApiResponse({
    status: 200,
    description: 'Work experience updated successfully',
    type: WorkExperienceResponseDto,
  })
  async updateWorkExperience(
    @CurrentUser() user: User,
    @Param('workExperienceId') workExperienceId: string,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
  ): Promise<WorkExperienceResponseDto> {
    return this.commandBus.execute(
      new UpdateWorkExperienceCommand(
        user.id,
        workExperienceId,
        updateWorkExperienceDto,
      ),
    );
  }

  @Delete('work-experience/:workExperienceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete work experience' })
  @ApiResponse({
    status: 204,
    description: 'Work experience deleted successfully',
  })
  async deleteWorkExperience(
    @CurrentUser() user: User,
    @Param('workExperienceId') workExperienceId: string,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteWorkExperienceCommand(user.id, workExperienceId),
    );
  }

  @Post('full')
  @ApiOperation({ summary: 'Crear candidato con toda la información' })
  @ApiResponse({
    status: 201,
    description: 'Candidato y toda su información creada exitosamente',
    type: CandidateResponseDto,
  })
  async createFullCandidate(
    @CurrentUser() user: User,
    @Body() createFullCandidateDto: CreateFullCandidateDto, // ahora tipado correctamente
  ): Promise<CandidateResponseDto> {
    return this.commandBus.execute(
      new CreateFullCandidateCommand(user.id, createFullCandidateDto),
    );
  }

  @Get('full/:id')
  @ApiOperation({ summary: 'Obtener candidato completo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Candidato con toda su información',
    type: CandidateResponseDto, // Puedes crear un DTO más completo si lo necesitas
  })
  async getFullCandidateById(@Param('id') id: string): Promise<any> {
    // Busca el candidato con todas sus relaciones
    return this.queryBus.execute(new GetFullCandidateByIdQuery(id));
  }

  @Get(':id/cv-history')
  @ApiOperation({ summary: 'Obtiene el historial de CVs de un candidato' })
  @ApiOkResponse({ type: [CandidateCVHistory] })
  async getCVHistory(
    @Param('id') candidateId: string,
  ): Promise<CandidateCVHistory[]> {
    return this.queryBus.execute(new GetCandidateCVHistoryQuery(candidateId));
  }

  @Post('apply')
  @ApiOperation({ summary: 'Aplicar a una oferta de trabajo' })
  @ApiResponse({
    status: 201,
    description: 'Aplicación a la oferta realizada exitosamente',
  })
  async applyToJobOffer(
    @Body() applyToJobOfferDto: ApplyToJobOfferDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    return this.commandBus.execute(
      new ApplyToJobOfferCommand(user.id, applyToJobOfferDto.jobOfferId),
    );
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Listar aplicaciones del candidato' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de aplicaciones del candidato',
  })
  async getJobApplications(
    @Param('id') candidateId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedJobApplicationsResponseDto> {
    return this.queryBus.execute(
      new GetCandidateJobApplicationsQuery(
        candidateId,
        Number(page),
        Number(limit),
      ),
    );
  }
}
