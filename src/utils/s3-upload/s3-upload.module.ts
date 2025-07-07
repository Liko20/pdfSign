import { Module } from '@nestjs/common';
import { S3UploadService } from './s3-upload.service';

@Module({
  exports: [S3UploadService],
  providers: [S3UploadService],
})
export class S3UploadModule {}
