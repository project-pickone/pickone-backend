import { Module } from '@nestjs/common';
import { LoginTokenService } from './login-token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loginTokenConfig from './config/login-token.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(loginTokenConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('loginToken.secret'),
        signOptions: { expiresIn: configService.get('loginToken.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [LoginTokenService],
  exports: [LoginTokenService],
})
export class LoginTokenModule {}
