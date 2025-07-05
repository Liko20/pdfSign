import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { DocumentModule } from './document/document.module';
import { DocumensoModule } from './documenso/documenso.module';

@Module({
  imports: [PdfModule, DocumentModule, DocumensoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
