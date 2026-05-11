import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AccountRepository } from './account.repository';
import { HashModule } from '../../common/modules/hash/hash.module';
import { UserService } from './user.service';

@Module({
  imports: [HashModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, AccountRepository],
  exports: [],
})
export class UserModule {}
