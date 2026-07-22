import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Injectable,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsUpload {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const region = this.configService.get<string>('appConfig.awsRegion');
    const accessKeyId = this.configService.get<string>(
      'appConfig.awsClientKey',
    );
    const secretAccessKey = this.configService.get<string>(
      'appConfig.awsSecretKey',
    );
    const bucketName = this.configService.get<string>(
      'appConfig.awsBucketName',
    );

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new ServiceUnavailableException(
        'AWS S3 uploads are not configured for this environment.',
      );
    }

    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    const fileName = this.generateFileName(file);

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);
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
