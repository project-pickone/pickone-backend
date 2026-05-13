import { PrismaClient } from '@generated/prisma/client';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_COMMENT, SelectComment } from './entity/prisma/select-comment';

@Injectable()
export class CommentRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaClient>
    >,
  ) {}

  public async selectCommentCount(boardIdx: number): Promise<number> {
    return await this.txHost.tx.comment.count({
      where: { boardIdx, deletedAt: null },
    });
  }

  public async selectCommentAll(
    boardIdx: number,
    page: number,
    loginUserId: string,
  ): Promise<SelectComment[]> {
    return await this.txHost.tx.comment.findMany({
      select: SELECT_COMMENT(loginUserId).select,
      where: { boardIdx, deletedAt: null },
      take: 10,
      skip: (page - 1) * 10,
      orderBy: { idx: 'desc' },
    });
  }

  public async selectCommentByIdx(idx: number): Promise<SelectComment | null> {
    return await this.txHost.tx.comment.findUnique({
      where: { idx, deletedAt: null },
      ...SELECT_COMMENT(),
    });
  }

  public async insertComment(
    boardIdx: number,
    optionIdx: number,
    authorId: string,
    contents: string,
  ): Promise<SelectComment> {
    const comment = await this.txHost.tx.comment.create({
      select: SELECT_COMMENT().select,
      data: {
        boardIdx,
        optionIdx,
        authorId,
        snapshots: {
          create: { contents },
        },
      },
    });

    await this.txHost.tx.board.update({
      where: { idx: boardIdx },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  public async updateCommentByIdx(
    idx: number,
    contents: string,
  ): Promise<void> {
    await this.txHost.tx.commentSnapshot.create({
      data: {
        commentIdx: idx,
        contents,
      },
    });
  }

  public async deleteCommentByIdx(
    idx: number,
    boardIdx: number,
  ): Promise<void> {
    await this.txHost.tx.comment.update({
      where: { idx },
      data: { deletedAt: new Date() },
    });

    await this.txHost.tx.board.update({
      where: { idx: boardIdx },
      data: { commentCount: { decrement: 1 } },
    });
  }

  // ── Like ───────────────────────────────────────────────────────────────

  public async selectCommentLike(commentIdx: number, userId: string) {
    return await this.txHost.tx.commentLike.findFirst({
      where: { commentIdx, userId },
    });
  }

  public async insertCommentLike(
    commentIdx: number,
    userId: string,
  ): Promise<void> {
    await this.txHost.tx.commentLike.create({
      data: { commentIdx, userId },
    });

    await this.txHost.tx.comment.update({
      where: { idx: commentIdx },
      data: { likeCount: { increment: 1 } },
    });
  }

  public async deleteCommentLike(
    commentIdx: number,
    userId: string,
  ): Promise<void> {
    await this.txHost.tx.commentLike.deleteMany({
      where: { commentIdx, userId },
    });

    await this.txHost.tx.comment.update({
      where: { idx: commentIdx },
      data: { likeCount: { decrement: 1 } },
    });
  }

  // ── Dislike ────────────────────────────────────────────────────────────

  public async selectCommentDislike(commentIdx: number, userId: string) {
    return await this.txHost.tx.commentDislike.findFirst({
      where: { commentIdx, userId },
    });
  }

  public async insertCommentDislike(
    commentIdx: number,
    userId: string,
  ): Promise<void> {
    await this.txHost.tx.commentDislike.create({
      data: { commentIdx, userId },
    });

    await this.txHost.tx.comment.update({
      where: { idx: commentIdx },
      data: { dislikeCount: { increment: 1 } },
    });
  }

  public async deleteCommentDislike(
    commentIdx: number,
    userId: string,
  ): Promise<void> {
    await this.txHost.tx.commentDislike.deleteMany({
      where: { commentIdx, userId },
    });

    await this.txHost.tx.comment.update({
      where: { idx: commentIdx },
      data: { dislikeCount: { decrement: 1 } },
    });
  }
}
