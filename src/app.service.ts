import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(private authService: AuthService) {}
  // Функция конфигурации сервера с созданной интеграцией
  async configuration(code: string, referer: string) {
    this.authService.setVariables(code, referer);
    console.log(`Authorization code successfully got from ${referer}`);
    await this.authService.getTokenWithAuthCode();
    console.log('Tokens successfully got');
  }
}
