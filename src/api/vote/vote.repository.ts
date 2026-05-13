import { PrismaClient } from '@generated/prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VoteRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  public async selectVote(optionIdx: number, loginUserId: string) {
    return await this.txHost.tx.vote.findFirst({
      where: {
        optionIdx,
        userId: loginUserId,
      },
    });
  }

  public async insertVote(
    optionIdx: number,
    loginUserId: string,
  ): Promise<void> {
    await this.txHost.tx.vote.create({
      data: {
        optionIdx,
        userId: loginUserId,
      },
    });
  }
}
