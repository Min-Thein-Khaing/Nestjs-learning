import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsUpload {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    // Instantiate S3 Client once per service lifecycle
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY')!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = this.generateFileName(file);

    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return fileName;
    } catch (error) {
      throw new RequestTimeoutException((error as Error).message);
    }
  }

  async multipleFileUpload(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  private generateFileName(file: Express.Multer.File): string {
    const name = file.originalname.split('.')[0];
    const nameReplace = name.replace(/\s+/g, '').trim();
    const extension = path.extname(file.originalname);
    const timeStamp = Date.now().toString();

    return `${nameReplace}-${timeStamp}-${uuidv4()}${extension}`;
  }
}
