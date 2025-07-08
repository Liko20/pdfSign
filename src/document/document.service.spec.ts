import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumensoApiService } from '../utils/documenso-api/documenso-api.service';
import { S3UploadService } from '../utils/s3-upload/s3-upload.service';

describe('DocumentService', () => {
  let service: DocumentService;

  const mockDocumensoApiService = {
    createDocumentAndGetPresignedUrl: jest.fn(),
    addEsignTags: jest.fn(),
    getDocumentDetails: jest.fn(),
    getDownloadUrl: jest.fn(),
    sendDocument: jest.fn(),
  };

  const mockS3UploadService = {
    uploadFileToPresignedUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: DocumensoApiService, useValue: mockDocumensoApiService },
        { provide: S3UploadService, useValue: mockS3UploadService },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should upload a PDF', async () => {
    const file = {
      path: 'path/to/file.pdf',
      mimetype: 'application/pdf',
    } as Express.Multer.File;
    const body = {
      email: 'user@example.com',
      role2Name: 'Signer 1',
      role3Name: 'Signer 2',
      title: 'Test Contract',
    };

    const docResponse = {
      data: { uploadUrl: 'http://mock-url.com', documentId: '123' },
    };
    mockDocumensoApiService.createDocumentAndGetPresignedUrl.mockResolvedValue(
      docResponse,
    );
    mockS3UploadService.uploadFileToPresignedUrl.mockResolvedValue({});

    const result = await service.handleUpload(file, body);
    expect(result.message).toBe('PDF uploaded successfully');
    expect(
      mockDocumensoApiService.createDocumentAndGetPresignedUrl,
    ).toHaveBeenCalled();
    expect(mockS3UploadService.uploadFileToPresignedUrl).toHaveBeenCalled();
  });

  it('should add sign tags', async () => {
    const body = {
      documentId: '123',
      role1Tag: { reciepientId: 1, x: 10, y: 10, page: 1 },
      role2Tag: { reciepientId: 2, x: 20, y: 20, page: 1 },
    };

    const result = await service.addSignTags(body);
    expect(result.message).toBe('Signature tags added successfully');
    expect(mockDocumensoApiService.addEsignTags).toHaveBeenCalledWith(body);
  });

  it('should fetch document details', async () => {
    const mockData = { id: '123', title: 'Test' };
    mockDocumensoApiService.getDocumentDetails.mockResolvedValue(mockData);
    const result = await service.getDocumentDetails('123');
    expect(result).toEqual({
      message: 'Document details fetched successfully',
      ...mockData,
    });
  });

  it('should download document', async () => {
    const mockData = { url: 'http://download-url' };
    mockDocumensoApiService.getDownloadUrl.mockResolvedValue(mockData);
    const result = await service.downloadDocument('123');
    expect(result).toEqual({
      message: 'Document downloaded successfully',
      ...mockData,
    });
  });

  it('should send document for signing', async () => {
    const mockData = { success: true };
    mockDocumensoApiService.sendDocument.mockResolvedValue(mockData);
    const result = await service.signDocument('123');
    expect(result).toEqual({
      message: 'Document signed successfully',
      ...mockData,
    });
  });
});
