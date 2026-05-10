import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SelectAccount } from './entity/prisma/select-account';
import { PrismaService } from '../../common/modules/prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaService>
    >,
  ) {}

  public async insertAccount(
    id: string,
    userId: string,
    hashedPassword: string,
  ): Promise<SelectAccount> {
    return this.txHost.tx.account.create({
      select: {
        id: true,
        userId: true,
        pw: true,
      },
      data: {
        id,
        userId,
        pw: hashedPassword,
      },
    });
  }

  public async selectAccountByUserId(
    userId: string,
  ): Promise<SelectAccount | null> {
    return await this.txHost.tx.account.findFirst({
      select: {
        id: true,
        userId: true,
        pw: true,
      },
      where: {
        userId,
      },
    });
  }

  public async updatePasswordByUserId(
    id: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.txHost.tx.account.update({
      where: {
        id,
      },
      data: {
        pw: hashedPassword,
      },
    });
  }
}
