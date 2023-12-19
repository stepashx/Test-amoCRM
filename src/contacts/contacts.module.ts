import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { HttpAmoCrmModule } from '../http-amo-crm/http-amo-crm.module';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [HttpAmoCrmModule, AuthModule, TransactionModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
