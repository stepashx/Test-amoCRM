import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpAmoCrmModule } from '../http-amo-crm/http-amo-crm.module';

@Module({
  imports: [HttpAmoCrmModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
