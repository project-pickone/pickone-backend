import { Prisma } from '@generated/prisma/browser';
import { SELECT_BOARD_AUTHOR } from './select-board-author';
import { SELECT_BOARD_OPTIONS } from './select-board-options';

export const SELECT_BOARD = {
  select: {
    idx: true,
    author: {
      select: SELECT_BOARD_AUTHOR.select,
    },
    snapshots: {
      select: {
        title: true,
        contents: true,
      },
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    },
    createdAt: true,
    options: {
      select: SELECT_BOARD_OPTIONS.select,
      orderBy: {
        sortOrder: 'asc',
      },
    },
  },
} satisfies Prisma.BoardDefaultArgs;

export type SelectBoard = Prisma.BoardGetPayload<typeof SELECT_BOARD>;
