import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumensoModule } from 'src/utils/documenso-api/documenso.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [DocumensoModule],
})
export class DocumentModule {}
