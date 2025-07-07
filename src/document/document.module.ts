import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumensoModule } from 'src/utils/documenso-api/documenso.module';
import { S3UploadModule } from 'src/utils/s3-upload/s3-upload.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [DocumensoModule, S3UploadModule],
})
export class DocumentModule {}
