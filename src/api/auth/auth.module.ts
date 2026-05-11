import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountRepository } from '../user/account.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, AccountRepository],
  exports: [],
})
export class AuthModule {}
