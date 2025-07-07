import { Injectable } from '@nestjs/common';
import {
  CreateDocumentDto,
  UploadPdfDto,
  AddEsignTagsDto,
} from './dto/document.dto';
import { DocumensoApiService } from '../utils/documenso-api/documenso-api.service';
import { S3UploadService } from 'src/utils/s3-upload/s3-upload.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly documensoApiService: DocumensoApiService,
    private readonly s3UploadService: S3UploadService,
  ) {}

  async handleUpload(file: Express.Multer.File, body: UploadPdfDto) {
    // assuming now we only need to do it for 2 roles
    // if we want dynamic number of roles, we can add a loop here to populate the data
    // and we will need an database to keep track of the documents and their recipients

    const documentPayload: CreateDocumentDto = {
      title: body.title || 'Contract',
      recipients: [
        {
          name: body.role2Name || 'Role2',
          email: body.email,
          role: 'SIGNER',
          signingOrder: 1,
        },
        {
          name: body.role3Name || 'Role3',
          email: 'dummy@gmail.com',
          role: 'SIGNER',
          signingOrder: 2,
        },
      ],
      meta: {
        signingOrder: 'SEQUENTIAL',
        allowDictateNextSigner: true,
      },
    };

    // now call the documenso Api to create the document with role1Email and role2 Dummy Email
    const response =
      await this.documensoApiService.createDocumentAndGetPresignedUrl(
        file,
        documentPayload,
      );

    await this.s3UploadService.uploadFileToPresignedUrl(
      file,
      response.data.uploadUrl,
    );
    return {
      message: 'PDF uploaded successfully',
      ...response.data,
    };
  }

  async addSignTags(body: AddEsignTagsDto) {
    // this functionnwill take two x,y coordinates and add signn tags to the document
    await this.documensoApiService.addEsignTags(body);
    return {
      message: 'Signature tags added successfully',
      documentId: body.documentId,
      role1Tag: body.role1Tag,
      role2Tag: body.role2Tag,
    };
  }

  async getDocumentDetails(id: string) {
    const data = await this.documensoApiService.getDocumentDetails(id);
    return {
      message: 'Document details fetched successfully',
      ...data,
    };
  }

  async downloadDocument(id: string) {
    const data = await this.documensoApiService.getDownloadUrl(id);
    return {
      message: 'Document downloaded successfully',
      ...data,
    };
  }

  async signDocument(id: string) {
    const data = await this.documensoApiService.sendDocument(id);
    return {
      message: 'Document signed successfully',
      ...data,
    };
  }
}
