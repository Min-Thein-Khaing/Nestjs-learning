import { BadRequestException, Injectable } from '@nestjs/common';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AwsUpload } from './aws-upload';

@Injectable()
export class UploadService {
  constructor(
    /**
     * reposity
     */
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,

    /**
     * config
     */
    private readonly configService: ConfigService,

    /**
     * inject aws upload provider
     */
    private readonly awsUploadProvider: AwsUpload,
  ) {}
  async uploadFile(file: Express.Multer.File) {
    if (
      ![
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
        'image/webp',
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException('Unsupported file type');
    }
    try {
      const fileName = await this.awsUploadProvider.uploadFile(file);
      const uploadFile = {
        name: fileName,
        path: `https://${this.configService.get<string>('appConfig.awsCloudFrontUrl')}/${fileName}`,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
