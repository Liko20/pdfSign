import { Module } from '@nestjs/common';
import { DocumensoService } from './documenso.service';
import { DocumensoController } from './documenso.controller';

@Module({
  controllers: [DocumensoController],
  providers: [DocumensoService],
})
export class DocumensoModule {}
