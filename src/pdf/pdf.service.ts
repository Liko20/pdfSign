import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  async handleUpload(file: Express.Multer.File) {
    return {
      message: 'PDF uploaded successfully',
      filePath: file.path,
      originalName: file.originalname,
    };
  }
}
