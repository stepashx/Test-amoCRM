import { Controller } from '@nestjs/common';
import { HttpAmoCrmService } from './http-amo-crm.service';

@Controller('http-amo-crm')
export class HttpAmoCrmController {
  constructor(private readonly httpAmoCrmService: HttpAmoCrmService) {}
}
