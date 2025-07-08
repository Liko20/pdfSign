import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class S3UploadService {
  async uploadFileToPresignedUrl(
    file: Express.Multer.File,
    presignedUrl: string,
  ) {
    if (!presignedUrl) throw new Error('Pre-signed URL is required');
    if (!file?.path) throw new Error('File path is missing');

    const fileStream = fs.createReadStream(file.path);
    const fileSize = fs.statSync(file.path).size;

    try {
      await axios.put(presignedUrl, fileStream, {
        headers: {
          'Content-Type': file.mimetype,
          'Content-Length': fileSize,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      fs.unlinkSync(file.path);

      return { message: 'Uploaded and cleaned up successfully!' };
    } catch (error) {
      // console.error(
      //   'Error uploading file to S3:',
      //   error.response?.data || error.message,
      // );
      throw error;
    }
  }
}
