import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async configuration(
    @Query('code') code: string,
    @Query('referer') referer: string,
  ) {
    await this.appService.configuration(code, referer);
    console.log(`Configuration is over with ${referer}`);
    return 'OK';
  }
}
