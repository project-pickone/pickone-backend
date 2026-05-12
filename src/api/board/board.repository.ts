import { PrismaClient } from '@generated/prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { SELECT_BOARD, SelectBoard } from './entity/prisma/select-board';
import { UpdateBoardDto } from './dto/request/update-board.dto';
import { GetBoardAllRequestDto } from './dto/request/get-board-all.dto';
import { SELECT_BOARD_OVERVIEW } from './entity/prisma/select-board-overview';

@Injectable()
export class BoardRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  public async selectBoardAll(dto: GetBoardAllRequestDto) {
    return await this.txHost.tx.board.findMany({
      select: SELECT_BOARD_OVERVIEW.select,
      where: {
        AND: [
          { deletedAt: null },
          dto.category
            ? {
                categories: {
                  some: {
                    categoryIdx: dto.category,
                  },
                },
              }
            : {},
        ],
      },
      take: 10,
      skip: (dto.page - 1) * 10,
      orderBy: {
        idx: 'desc',
      },
    });
  }

  public async selectBoardByIdx(idx: number): Promise<SelectBoard | null> {
    return await this.txHost.tx.board.findUnique({
      where: { idx, deletedAt: null },
      ...SELECT_BOARD,
    });
  }

  public async insertBoard(
    dto: CreateBoardDto,
    authorId: string,
  ): Promise<SelectBoard> {
    return await this.txHost.tx.board.create({
      select: SELECT_BOARD.select,
      data: {
        authorId,
        snapshots: {
          create: {
            title: dto.title,
            contents: dto.contents,
          },
        },
        options: {
          createMany: {
            data: [dto.firstOption, dto.secondOption].map((option, i) => ({
              sortOrder: i + 1,
              contents: option,
              count: 0,
            })),
          },
        },
        categories: {
          createMany: {
            data: dto.category.map((categoryIdx) => ({
              categoryIdx,
            })),
          },
        },
      },
    });
  }

  public async updateBoardByIdx(
    idx: number,
    dto: UpdateBoardDto,
  ): Promise<void> {
    await this.txHost.tx.boardSnapshot.create({
      data: {
        boardIdx: idx,
        title: dto.title,
        contents: dto.contents,
      },
    });
  }

  public async deleteBoardByIdx(idx: number): Promise<void> {
    await this.txHost.tx.board.update({
      where: { idx },
      data: { deletedAt: new Date() },
    });
  }
}
