import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { HttpAmoCrmService } from './http-amo-crm/http-amo-crm.service';

@Injectable()
export class AppService {
  constructor(
    private authService: AuthService,
    private httpAmoService: HttpAmoCrmService,
  ) {}
  // Функция конфигурации сервера с созданной интеграцией
  async configuration(code: string, referer: string) {
    this.httpAmoService.setUrl(referer);
    await this.authService.getTokenWithAuthCode(code);
    console.log('Tokens successfully got');
  }
}
