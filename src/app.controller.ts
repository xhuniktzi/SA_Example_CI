import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/roles.guard';
import { Role } from './common/role.enum';
import { Roles } from './common/roles.decorator';

@Controller()
export class AppController {
  private readonly http = axios.create({
    baseURL: 'https://open.er-api.com/v6/latest',
  });
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {

  }


  // @UseGuards(JwtAuthGuard)
  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('system/protected')
  getProtected() {
    return { message: 'This is a protected route' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('system/admin-only')
  getAdminOnly() {
    return { message: 'This is an admin-only route' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('system/user-only')
  getUserOnly() {
    return { message: 'This is a user-only route' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('system/both-roles')
  getBothRoles() {
    return { message: 'This route is accessible by both Admin and User roles' };
  }

  @Get('health/ready')
  async getReadiness() {
    // Verificar dependências críticas aquí
    const result = await this.http.get(`USD`)
    if (result.status !== 200) {
      console.log('Currency service is down');
      return HttpCode(503);
    }

    console.log('All systems operational');
    return HttpCode(200);
  }

  @Get('health/live')
  getLiveness() {
    // Verificar se a aplicação está rodando
    console.log('Application is live');
    return HttpCode(200);
  }
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('currency/:currency')
  async getCurrency(
    @Param('currency')
    currency: string,
  ): Promise<any> {
    const result = await this.http.get(`/${currency}`)
    console.log(`Currency data for ${currency}:`, result.data);
    return result.data;
  }
}
