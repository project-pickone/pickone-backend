import { Prisma } from '@generated/prisma/browser';
import { SELECT_COMMENT_AUTHOR } from './select-comment-author';

export const SELECT_COMMENT = {
  select: {
    idx: true,
    optionIdx: true,
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
  },
} satisfies Prisma.CommentDefaultArgs;

export type SelectComment = Prisma.CommentGetPayload<typeof SELECT_COMMENT>;
