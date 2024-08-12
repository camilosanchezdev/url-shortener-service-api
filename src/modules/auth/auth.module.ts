import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalMasterStrategy } from './strategies/local-master.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.TOKEN_EXPIRATION ?? '1d',
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalMasterStrategy,
    // EmailService,
    // RegisterTokensService,
    // CustomerWebsitesService,
    // WebsitesService,
    // ForgotPasswordTokensService,
    // GoogleAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
