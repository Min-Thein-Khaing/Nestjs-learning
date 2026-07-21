import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor() {}
  async uploadFile(file: Express.Multer.File) {}
}
