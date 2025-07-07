import { Module } from '@nestjs/common';
import { DocumensoApiService } from './documenso-api.service';

@Module({
  exports: [DocumensoApiService],
  providers: [DocumensoApiService],
})
export class DocumensoModule {}
