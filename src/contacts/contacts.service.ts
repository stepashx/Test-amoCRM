import { Injectable } from '@nestjs/common';
import { HttpAmoCrmService } from '../http-amo-crm/http-amo-crm.service';
import { AuthService } from '../auth/auth.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ContactsService {
  private readonly path = '/api/v4/contacts';
  constructor(
    private httpAmoCrmService: HttpAmoCrmService,
    private authService: AuthService,
    private transactionService: TransactionService,
  ) {}
  async action(name: string, email: string, phone: number) {
    let contact = await this.findByPhone(phone);
    if (!contact) {
      contact = await this.create(name, email, phone);
      const id = contact._embedded.contacts[0].id;
      return await this.transactionService.create(id);
    }
    const id = contact._embedded.contacts[0].id;
    await this.update(id, name, email, phone);
    return await this.transactionService.create(id);
  }
  async findByPhone(phone: number) {
    const query = [{ key: 'query', value: phone }];
    const config = await this.authService.getConfig();
    return await this.httpAmoCrmService.getReq(this.path, query, config);
  }
  async create(name: string, email: string, phone: number) {
    const body: CreateContactDto[] = [
      {
        name: name,
        custom_fields_values: [
          {
            field_id: 628107,
            values: [{ value: email }],
          },
          {
            field_id: 628105,
            values: [{ value: phone }],
          },
        ],
      },
    ];
    const config = await this.authService.getConfig();
    return await this.httpAmoCrmService.postReq<CreateContactDto[]>(
      this.path,
      body,
      config,
    );
  }
  async update(id: number, name: string, email: string, phone: number) {
    const body: UpdateContactDto = {
      id: id,
      name: name,
      custom_fields_values: [
        {
          field_id: 628107,
          values: [{ value: email }],
        },
        {
          field_id: 628105,
          values: [{ value: phone }],
        },
      ],
    };
    const config = await this.authService.getConfig();
    return await this.httpAmoCrmService.patchReq<UpdateContactDto>(
      this.path + `/${id}`,
      body,
      config,
    );
  }
}
