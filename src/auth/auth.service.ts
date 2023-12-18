import { Injectable } from '@nestjs/common';
import { PostAuthCodeRequestDto } from './dto/post-auth-code-request.dto';
import { HttpService } from '@nestjs/axios';
import { TokenDto } from './dto/token.dto';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PostRefreshTokenRequestDto } from './dto/post-refresh-token-request.dto';

@Injectable()
export class AuthService {
  private code: string;
  private referer: string;
  private token: TokenDto;
  private token_updated_at: number;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  // Функция сохранения кода авторизации и ссылки на саму crm
  setVariables(code: string, referer: string) {
    this.code = code;
    this.referer = referer;
  }
  // Функция получения access и refresh токенов с помощью кода авторизации
  async getTokenWithAuthCode() {
    const body: PostAuthCodeRequestDto = {
      client_id: this.configService.get<string>('INTEGRATION_ID'),
      client_secret: this.configService.get<string>('SECRET_KEY'),
      grant_type: 'authorization_code',
      code: this.code,
      redirect_uri: this.configService.get<string>('HOST_URI'),
    };
    this.token = await this.postTokens(body);
    this.token_updated_at = Date.now();
  }
  // Функция обновления access токена с помощью refresh токена
  async getTokenWithRefreshToken() {
    const body: PostRefreshTokenRequestDto = {
      client_id: this.configService.get<string>('INTEGRATION_ID'),
      client_secret: this.configService.get<string>('SECRET_KEY'),
      grant_type: 'refresh_token',
      refresh_token: this.token.refresh_token,
      redirect_uri: this.configService.get<string>('HOST_URI'),
    };
    this.token = await this.postTokens(body);
    this.token_updated_at = Date.now();
  }
  // Функция обращения к серверу за данными о токенах
  async postTokens(body) {
    const { data } = await firstValueFrom(
      this.httpService.post<TokenDto>(
        'https://' + this.referer + '/oauth2/access_token',
        body,
      ),
    );
    return data;
  }
  // Проверка валидности access токена
  checkToken() {
    return Date.now() - this.token_updated_at <= this.token.expires_in;
  }
}
