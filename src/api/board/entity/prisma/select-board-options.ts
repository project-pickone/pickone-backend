import { Prisma } from '@generated/prisma/browser';

export const SELECT_BOARD_OPTIONS = (loginUserId?: string) =>
  ({
    select: {
      idx: true,
      sortOrder: true,
      contents: true,
      count: true,
      votes: {
        select: {
          id: true,
        },
        take: 1,
        where: {
          userId: loginUserId,
        },
      },
    },
  }) satisfies Prisma.BoardOptionDefaultArgs;

export type SelectBoardOption = Prisma.BoardOptionGetPayload<
  ReturnType<typeof SELECT_BOARD_OPTIONS>
>;
