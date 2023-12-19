import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { HttpAmoCrmModule } from '../http-amo-crm/http-amo-crm.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpAmoCrmModule, AuthModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
