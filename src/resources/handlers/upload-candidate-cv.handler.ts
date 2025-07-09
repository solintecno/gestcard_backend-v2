import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCandidateCVCommand } from '../commands/upload-candidate-cv.command';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CandidateCVHistoryService } from '../../candidates/services/candidate-cv-history.service';
import { Inject } from '@nestjs/common';

@CommandHandler(UploadCandidateCVCommand)
export class UploadCandidateCVHandler
  implements ICommandHandler<UploadCandidateCVCommand>
{
  constructor(
    @Inject(CandidateCVHistoryService)
    private readonly cvHistoryService: CandidateCVHistoryService,
  ) {}

  async execute(command: UploadCandidateCVCommand): Promise<any> {
    const { file, userId } = command;
    if (
      !file ||
      typeof file.originalname !== 'string' ||
      !(file.buffer instanceof Buffer) ||
      typeof file.size !== 'number'
    ) {
      return { message: 'No file received or file is invalid' };
    }
    // Define the directory and file path
    const uploadDir = path.resolve(__dirname, '../../../uploads', userId);
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.originalname);
    // Save the file buffer to disk
    await fs.writeFile(filePath, file.buffer);

    // Buscar el id de candidato asociado al usuario
    // Aquí deberías obtener el candidateId a partir del userId
    // Por ahora, se asume que userId === candidateId (ajusta según tu lógica real)
    const candidateId = userId;
    await this.cvHistoryService.addCVHistory(candidateId, filePath);

    return {
      message: 'CV recibido y guardado correctamente',
      originalname: file.originalname,
      size: file.size,
      path: filePath,
      userId,
    };
  }
}
