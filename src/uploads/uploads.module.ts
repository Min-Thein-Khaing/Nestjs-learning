import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadService } from './provider/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadService],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
