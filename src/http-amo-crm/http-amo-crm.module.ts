import { Module } from '@nestjs/common';
import { HttpAmoCrmService } from './http-amo-crm.service';
import { HttpAmoCrmController } from './http-amo-crm.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [HttpAmoCrmController],
  providers: [HttpAmoCrmService],
  exports: [HttpAmoCrmService],
})
export class HttpAmoCrmModule {}
