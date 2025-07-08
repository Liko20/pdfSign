import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentService } from './document.service';
import { AddEsignTagsDto, UploadPdfDto } from './dto/document.dto';
import { existsSync, mkdirSync } from 'fs';
@Controller('pdf')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Simple filename handling but with basic sanitization
          const safeName = file.originalname
            .replace(/[^\w.-]/g, '_') // Replace special chars with underscore
            .replace(/\s+/g, '_'); // Replace spaces with underscore
          cb(null, safeName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/i)) {
          return cb(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB limit
      },
    }),
  )
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadPdfDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Debugging logs
    console.log('File saved at:', file.path);
    console.log('File details:', {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
    });

    return this.documentService.handleUpload(file, body);
  }

  @Get('view/:filename')
  async viewPdf(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename || typeof filename !== 'string') {
      throw new BadRequestException('Invalid filename');
    }

    if (!filename.toLowerCase().endsWith('.pdf')) {
      throw new BadRequestException('Only PDF files can be viewed');
    }

    const safeFilename = filename.replace(/[^\w.-]/g, '_').replace(/\s+/g, '_');

    const filePath = join(process.cwd(), 'uploads', safeFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    try {
      return res.sendFile(filePath);
    } catch (err) {
      throw new InternalServerErrorException('Failed to send file');
    }
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
