import { Injectable } from '@nestjs/common';
import { AuthCodeRequestDto } from '../http-amo-crm/dto/auth-code-request.dto';
import { TokenEntity } from './entities/token.entity';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRequestDto } from '../http-amo-crm/dto/refresh-token-request.dto';
import { HttpAmoCrmService } from '../http-amo-crm/http-amo-crm.service';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class AuthService {
  private code: string;
  private token: TokenEntity;
  private token_updated_at: number;
  private readonly path = '/oauth2/access_token';
  constructor(
    private configService: ConfigService,
    private httpAmoCrm: HttpAmoCrmService,
  ) {}
  // Функция получения access и refresh токенов с помощью кода авторизации
  async getTokenWithAuthCode(code: string) {
    this.code = code;
    const body: AuthCodeRequestDto = {
      client_id: this.configService.get<string>('INTEGRATION_ID'),
      client_secret: this.configService.get<string>('SECRET_KEY'),
      grant_type: 'authorization_code',
      code: this.code,
      redirect_uri: this.configService.get<string>('HOST_URI'),
    };
    this.token = await this.httpAmoCrm.postReq<AuthCodeRequestDto>(
      this.path,
      body,
    );
    this.token_updated_at = Date.now();
  }
  // Функция обновления access токена с помощью refresh токена
  async getTokenWithRefreshToken() {
    const body: RefreshTokenRequestDto = {
      client_id: this.configService.get<string>('INTEGRATION_ID'),
      client_secret: this.configService.get<string>('SECRET_KEY'),
      grant_type: 'refresh_token',
      refresh_token: this.token.refresh_token,
      redirect_uri: this.configService.get<string>('HOST_URI'),
    };
    this.token = await this.httpAmoCrm.postReq<RefreshTokenRequestDto>(
      this.path,
      body,
    );
    this.token_updated_at = Date.now();
  }
  async getConfig(): Promise<AxiosRequestConfig> {
    if (!this.checkToken()) {
      await this.getTokenWithRefreshToken();
    }
    return {
      headers: {
        Authorization: `Bearer ${this.token.access_token}`,
      },
    };
  }
  // Проверка валидности access токена
  checkToken() {
    return Date.now() - this.token_updated_at <= this.token.expires_in;
  }
}
