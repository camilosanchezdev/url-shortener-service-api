import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { TokenType } from './types/token.type';
import { AuthResponseType } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async generateJWT(user: { res: User }): Promise<AuthResponseType> {
    const payload: TokenType = {
      sub: user.res.id,
      roleId: user.res.roleId,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user: User = await this.usersService.findOne(null, { email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...res } = user;
        return { res };
      }
    }
    return null;
  }
}
