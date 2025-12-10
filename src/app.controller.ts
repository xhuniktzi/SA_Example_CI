import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  private readonly http = axios.create({
    baseURL: 'https://open.er-api.com/v6/latest',
  });
  constructor(private readonly appService: AppService) {

  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('currency/:currency')
  async getCurrency(
    @Param('currency')
    currency: string,
  ): Promise<any> {
    const result = await this.http.get(`/${currency}`)
    console.log(`Currency data for ${currency}:`, result.data);
    return JSON.parse(result.data);
  }
}
