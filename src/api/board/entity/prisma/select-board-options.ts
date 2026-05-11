import { Prisma } from '@generated/prisma/browser';

export const SELECT_BOARD_OPTIONS = {
  select: {
    idx: true,
    sortOrder: true,
    contents: true,
    count: true,
  },
} satisfies Prisma.BoardOptionDefaultArgs;

export type SelectBoardOption = Prisma.BoardOptionGetPayload<
  typeof SELECT_BOARD_OPTIONS
>;
