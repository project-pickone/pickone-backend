import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AccountRepository } from './account.repository';
import { HashModule } from '../../common/modules/hash/hash.module';

@Module({
  imports: [HashModule],
  controllers: [UserController],
  providers: [UserRepository, AccountRepository],
  exports: [],
})
export class UserModule {}
