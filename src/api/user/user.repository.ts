import { Prisma } from '@generated/prisma/browser';
import { PrismaClient } from '@generated/prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/request/signup.dto';
import { SelectUser } from './entity/prisma/select-user';

@Injectable()
export class UserRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  public async insertUser(
    dto: Omit<SignupDto, 'password' | 'userId'>,
  ): Promise<SelectUser> {
    return this.txHost.tx.user.create({
      data: {
        nickname: dto.nickname,
        profileImage: dto.profileImg,
        birth: dto.birth,
      },
    });
  }
}
