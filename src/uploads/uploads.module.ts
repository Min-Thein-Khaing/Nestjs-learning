import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadService } from './provider/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { AwsUpload } from './provider/aws-upload';

@Module({
  controllers: [UploadsController],
  providers: [UploadService, AwsUpload],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
