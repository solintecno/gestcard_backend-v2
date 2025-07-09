export interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  size: number;
}

import { User } from '../../auth/entities/user.entity';

export class UploadCandidateCVCommand {
  constructor(
    public readonly file: UploadedFile,
    public readonly userId: string,
  ) {}
}
