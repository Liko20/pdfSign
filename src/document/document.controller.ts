import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentService } from './document.service';
import { AddEsignTagsDto, UploadPdfDto } from './dto/document.dto';
@Controller('pdf')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${file.originalname}`);
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
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadPdfDto,
  ) {
    console.log('inside controller');
    console.log('file', file);
    return await this.documentService.handleUpload(file, body);
  }

  @Post('add-sign-tags')
  async addSignTags(@Body() body: AddEsignTagsDto) {
    return await this.documentService.addSignTags(body);
  }

  @Get(':id')
  async getDocumentDetails(@Param('id') id: string) {
    // This method can be implemented to fetch document details by ID
    return await this.documentService.getDocumentDetails(id);
  }

  @Get('download/:id')
  async downloadDocument(@Param('id') id: string) {
    return await this.documentService.downloadDocument(id);
  }

  @Get('sign/:id')
  async signDocument(@Param('id') id: string) {
    return await this.documentService.signDocument(id);
  }
}
