import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDefined,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
class EsignTag {
  @IsNumber()
  reciepientId: number;

  @IsNumber()
  page: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width?: number;

  @IsNumber()
  height?: number;
}

export class AddEsignTagsDto {
  @IsDefined()
  documentId: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => EsignTag)
  role1Tag: EsignTag;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => EsignTag)
  role2Tag: EsignTag;
}
export class UploadPdfDto {
  @IsOptional()
  @IsString()
  role3Name: string;

  @IsOptional()
  @IsString()
  role2Name: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsEmail()
  email: string;
}

export class RecipientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsNumber()
  signingOrder: number;
}

export class MetaDto {
  @IsString()
  signingOrder: 'SEQUENTIAL' | 'PARALLEL';

  @IsBoolean()
  allowDictateNextSigner: boolean;
}

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  role2Name?: string;

  @IsOptional()
  @IsString()
  role3Name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;
}
