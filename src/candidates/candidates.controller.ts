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
} from './commands';
import { GetCandidateByIdQuery, GetCandidatesQuery } from './queries';

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
  ): Promise<CandidateResponseDto> {
    return this.commandBus.execute(
      new CreateCandidateCommand(createCandidateDto),
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
}
