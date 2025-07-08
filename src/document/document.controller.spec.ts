import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UploadPdfDto } from './dto/document.dto';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockService = {
    handleUpload: jest.fn(),
    addSignTags: jest.fn(),
    getDocumentDetails: jest.fn(),
    downloadDocument: jest.fn(),
    signDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should upload a PDF file', async () => {
    const mockFile = {
      originalname: 'test.pdf',
      path: 'mock/path/test.pdf',
    } as Express.Multer.File;
    const body = {
      email: 'user@example.com',
      role2Name: 'Signer 1',
      role3Name: 'Signer 2',
      title: 'Test Contract',
    };
    const result = { message: 'PDF uploaded successfully' };

    mockService.handleUpload.mockResolvedValue(result);
    expect(await controller.uploadPdf(mockFile, body)).toEqual(result);
    expect(service.handleUpload).toHaveBeenCalledWith(mockFile, body);
  });

  it('should add sign tags', async () => {
    const body = {
      documentId: '123',
      role1Tag: { reciepientId: 1, x: 10, y: 10, page: 1 },
      role2Tag: { reciepientId: 2, x: 50, y: 50, page: 1 },
    };
    const result = { message: 'Signature tags added successfully', ...body };

    mockService.addSignTags.mockResolvedValue(result);
    expect(await controller.addSignTags(body)).toEqual(result);
  });

  it('should get document details', async () => {
    const result = {
      message: 'Document details fetched successfully',
      id: '123',
    };
    mockService.getDocumentDetails.mockResolvedValue(result);
    expect(await controller.getDocumentDetails('123')).toEqual(result);
  });

  it('should download a document', async () => {
    const result = { message: 'Document downloaded successfully' };
    mockService.downloadDocument.mockResolvedValue(result);
    expect(await controller.downloadDocument('123')).toEqual(result);
  });

  it('should sign a document', async () => {
    const result = { message: 'Document signed successfully' };
    mockService.signDocument.mockResolvedValue(result);
    expect(await controller.signDocument('123')).toEqual(result);
  });
});
