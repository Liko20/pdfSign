import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateDocumentDto } from 'src/document/dto/document.dto';
@Injectable()
export class DocumensoApiService {
  async createDocumentAndGetPresignedUrl(recipientData: CreateDocumentDto) {
    try {
      return axios.post(
        process.env.DOCUMENSO_API_URL + '/documents',
        recipientData,
        {
          headers: {
            Authorization: process.env.DOCUMENSO_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        'Error:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw error;
    }
  }
}
