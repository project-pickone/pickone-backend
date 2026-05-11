import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountRepository } from '../user/account.repository';
import { HashModule } from '../../common/modules/hash/hash.module';
import { LoginTokenModule } from '../../common/modules/login-token/login-token.module';

@Module({
  imports: [HashModule],
  controllers: [AuthController],
  providers: [AuthService, AccountRepository],
  exports: [],
})
export class AuthModule {}
