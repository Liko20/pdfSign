import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class Position {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class UploadPdfDto {
  @IsString()
  role3Name: string;
  @IsString()
  role2Name: string;
  @IsString()
  title: string;
  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Position)
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  })
  positions: Position[];
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
