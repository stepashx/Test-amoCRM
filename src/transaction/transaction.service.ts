import { Injectable } from '@nestjs/common';
import { HttpAmoCrmService } from '../http-amo-crm/http-amo-crm.service';
import { AuthService } from '../auth/auth.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly path = 'api/v4/leads';
  constructor(
    private httpAmoCrmService: HttpAmoCrmService,
    private authService: AuthService,
  ) {}
  async create(contact_id: number) {
    const body: CreateTransactionDto[] = [
      {
        responsible_user_id: contact_id,
      },
    ];
    const config = await this.authService.getConfig();
    return await this.httpAmoCrmService.postReq<CreateTransactionDto[]>(
      this.path,
      body,
      config,
    );
  }
}
