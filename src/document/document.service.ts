import { Injectable } from '@nestjs/common';
import { CreateDocumentDto, UploadPdfDto } from './dto/document.dto';
import { DocumensoApiService } from '../utils/documenso-api/documenso-api.service';

@Injectable()
export class DocumentService {
  constructor(private readonly documensoApiService: DocumensoApiService) {}

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
          email: 'role3Dummy@gmail.com',
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
        documentPayload,
      );
    return {
      message: 'PDF uploaded successfully',
      ...response.data,
    };
  }
}
