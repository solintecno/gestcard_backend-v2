import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import {
  UploadCandidateCVCommand,
  UploadedFile as UploadedFileType,
} from './commands/upload-candidate-cv.command';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../security/decorators';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetCandidateCVHistoryQuery } from '../candidates/queries';
import { CandidateCVHistory } from '../candidates/entities/candidate-cv-history.entity';
import { Response } from 'express';
import * as path from 'path';

@ApiTags('resources')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('upload-cv')
  @ApiOperation({ summary: 'Sube el CV de un candidato' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo CV en formato PDF',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'CV recibido y guardado correctamente',
    schema: {
      example: {
        message: 'CV recibido y guardado correctamente',
        originalname: 'cv.pdf',
        size: 12345,
        path: '/uploads/cv.pdf',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @UploadedFile() file: UploadedFileType,
    @CurrentUser() user: User,
  ): Promise<{
    message: string;
    originalname?: string;
    size?: number;
    path?: string;
  }> {
    return this.commandBus.execute(new UploadCandidateCVCommand(file, user.id));
  }

  @Post('my-cv-history')
  @ApiOperation({
    summary: 'Recupera el historial de CVs del usuario autenticado',
  })
  @ApiResponse({ status: 200, type: [CandidateCVHistory] })
  async getMyCVHistory(
    @CurrentUser() user: User,
  ): Promise<CandidateCVHistory[]> {
    // Se asume que el user.id es igual al candidateId, ajusta si tu modelo es diferente
    return this.queryBus.execute(new GetCandidateCVHistoryQuery(user.id));
  }

  @Get('cv-latest/:candidateId')
  @ApiOperation({
    summary: 'Recupera el último CV subido de un candidato por id',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo CV en formato PDF',
    schema: { type: 'string', format: 'binary' },
  })
  async getLatestCVPath(
    @Param('candidateId') candidateId: string,
    @Res() res: Response,
  ) {
    const history = await this.queryBus.execute<
      GetCandidateCVHistoryQuery,
      Array<CandidateCVHistory>
    >(new GetCandidateCVHistoryQuery(candidateId));
    if (Array.isArray(history) && history.length > 0) {
      const filePath = history[0].cvPath;
      const fileName = filePath.split('/').pop() || 'cv.pdf';
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Type', 'application/pdf');
      return res.sendFile(filePath);
    }
    return res.status(404).json({ message: 'CV no encontrado' });
  }
}
