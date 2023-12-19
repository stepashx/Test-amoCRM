import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { QueryParamDto } from './dto/query-param.dto';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpAmoCrmService {
  private url: URL;
  constructor(private httpService: HttpService) {}
  setUrl(url: string) {
    this.url = new URL('https://' + url);
  }
  async patchReq<BodyType>(
    path: string,
    body: BodyType,
    config?: AxiosRequestConfig,
  ) {
    const url = new URL(path, this.url);
    const { data } = await firstValueFrom(
      this.httpService.patch(url.href, body, config),
    );
    return data;
  }
  async postReq<BodyType>(
    path: string,
    body: BodyType,
    config?: AxiosRequestConfig,
  ) {
    const url = new URL(path, this.url);
    const { data } = await firstValueFrom(
      this.httpService.post(url.href, body, config),
    );
    return data;
  }
  async getReq(
    path: string,
    query: QueryParamDto[],
    config?: AxiosRequestConfig,
  ) {
    const url = new URL(path, this.url);
    query.forEach((param) => {
      url.searchParams.append(param.key, param.value.toString());
    });
    const { data } = await firstValueFrom(
      this.httpService.get(url.href, config),
    );
    return data;
  }
}
