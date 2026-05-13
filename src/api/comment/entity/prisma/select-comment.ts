import { Prisma } from '@generated/prisma/browser';
import { SELECT_COMMENT_AUTHOR } from './select-comment-author';

export const SELECT_COMMENT = (loginUserId?: string) =>
  ({
    select: {
      idx: true,
      optionIdx: true,
      likeCount: true,
      dislikeCount: true,
      createdAt: true,
      author: {
        select: SELECT_COMMENT_AUTHOR.select,
      },
      snapshots: {
        select: {
          contents: true,
        },
        take: 1,
        orderBy: {
          createdAt: 'desc' as const,
        },
      },
      likes: {
        select: { id: true },
        take: 1,
        where: { userId: loginUserId },
      },
      dislikes: {
        select: { id: true },
        take: 1,
        where: { userId: loginUserId },
      },
    },
  }) satisfies Prisma.CommentDefaultArgs;

export type SelectComment = Prisma.CommentGetPayload<
  ReturnType<typeof SELECT_COMMENT>
>;
