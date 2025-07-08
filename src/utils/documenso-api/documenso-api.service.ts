import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  AddEsignTagsDto,
  CreateDocumentDto,
} from 'src/document/dto/document.dto';
@Injectable()
export class DocumensoApiService {
  async createDocumentAndGetPresignedUrl(
    file: Express.Multer.File,
    recipientData: CreateDocumentDto,
  ) {
    try {
      const response = await axios.post(
        process.env.DOCUMENSO_API_URL + '/documents',
        recipientData,
        {
          headers: {
            Authorization: process.env.DOCUMENSO_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      const documentId = response.data.documentId;
      console.log('Document created with ID:', documentId);
      return response;
    } catch (error) {
      console.log('error uploading to s3');
      // console.error(
      //   'Error:',
      //   JSON.stringify(error.response?.data || error.message, null, 2),
      // );
      throw error;
    }
  }

  async addEsignTags(data: AddEsignTagsDto) {
    try {
      await this.addSignatureTag(data.documentId, data.role1Tag);
      await this.addSignatureTag(data.documentId, data.role2Tag);
    } catch (error) {
      console.error(
        'Error:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw error;
    }
  }

  private async addSignatureTag(
    documentId: string,
    tag: {
      reciepientId: number;
      page: number;
      x: number;
      y: number;
      width?: number;
      height?: number;
    },
  ) {
    await axios.post(
      `${process.env.DOCUMENSO_API_URL}/documents/${documentId}/fields`,
      {
        recipientId: tag.reciepientId,
        type: 'SIGNATURE',
        pageNumber: tag.page,
        pageX: tag.x,
        pageY: tag.y,
        pageWidth: tag.width ?? 120,
        pageHeight: tag.height ?? 40,
      },
      { headers: { Authorization: process.env.DOCUMENSO_API_KEY } },
    );
  }

  async addRecipient(id: string) {
    const res = await axios.post(
      `${process.env.DOCUMENSO_API_URL}/documents/${id}/recipients`,
      {
        name: 'liko',
        email: 'hazarika857@gmail.com',
        role: 'SIGNER',
      },
      { headers: { Authorization: process.env.DOCUMENSO_API_KEY } },
    );
  }

  async getDownloadUrl(documentId: string) {
    try {
      const response = await axios.get(
        `${process.env.DOCUMENSO_API_URL}/documents/${documentId}/download`,
        {
          headers: {
            Authorization: process.env.DOCUMENSO_API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw error;
    }
  }

  async getDocumentDetails(documentId: string) {
    try {
      const response = await axios.get(
        `${process.env.DOCUMENSO_API_URL}/documents/${documentId}`,
        {
          headers: {
            Authorization: process.env.DOCUMENSO_API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw error;
    }
  }

  async sendDocument(documentId: string) {
    try {
      console.log('Sending document with ID:', documentId);
      const response = await axios.post(
        `${process.env.DOCUMENSO_API_URL}/documents/${documentId}/send`,
        {
          sendEmail: true,
          sendCompletionEmails: true,
        },
        {
          headers: {
            Authorization: process.env.DOCUMENSO_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Document sent:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error sending document:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw error;
    }
  }
}
