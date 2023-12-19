import { Controller, Get, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async action(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phone') phone: number,
  ) {
    return await this.contactsService.action(name, email, phone);
  }
}
