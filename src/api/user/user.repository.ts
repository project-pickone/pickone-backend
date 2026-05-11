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
      select: {
        id: true,
        nickname: true,
        profileImg: true,
        createdAt: true,
        birth: true,
      },
      data: {
        nickname: dto.nickname,
        profileImg: dto.profileImg,
        birth: dto.birth + 'T00:00:00.000Z',
      },
    });
  }

  public async selectUserById(userId: string): Promise<SelectUser | null> {
    return this.txHost.tx.user.findUnique({
      select: {
        id: true,
        nickname: true,
        profileImg: true,
        createdAt: true,
        birth: true,
      },
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  public async deleteUserById(userId: string): Promise<void> {
    await this.txHost.tx.user.update({
      data: { deletedAt: new Date() },
      where: { id: userId, deletedAt: null },
    });
  }

  public async updateUserById(
    id: string,
    dto: Omit<SignupDto, 'password' | 'userId'>,
  ): Promise<SelectUser> {
    return this.txHost.tx.user.update({
      data: {
        nickname: dto.nickname,
        profileImg: dto.profileImg,
        birth: dto.birth,
      },
      where: { id, deletedAt: null },
      select: {
        id: true,
        nickname: true,
        profileImg: true,
        createdAt: true,
        birth: true,
      },
    });
  }
}
