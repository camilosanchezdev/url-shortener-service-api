import { Controller, Req, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private engineService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req): Promise<any> {
    return this.engineService.generateJWT(req.user);
  }
  @Post('register')
  register(@Body() req: RegisterDto): Promise<any> {
    return this.engineService.register(req);
  }
}
