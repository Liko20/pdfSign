import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${file.originalname}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.pdf$/)) {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.pdfService.handleUpload(file);
  }
}
