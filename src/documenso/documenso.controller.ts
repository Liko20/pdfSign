import { Controller } from '@nestjs/common';
import { DocumensoService } from './documenso.service';

@Controller('documenso')
export class DocumensoController {
  constructor(private readonly documensoService: DocumensoService) {}
}
