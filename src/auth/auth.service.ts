import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  
  async validateUser(username: string, pass: string) {
    const user = await this.users.findByUsername(username);
    if (!user || user.password !== pass) throw new UnauthorizedException();

    
    const { password, ...safe } = user;
    return safe; 
  }

  async login(user: { userId: number; username: string }) {
    const payload = { sub: user.userId, username: user.username };
    return { access_token: await this.jwt.signAsync(payload) }; 
  }
}
