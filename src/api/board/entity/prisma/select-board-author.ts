import { Prisma } from '@generated/prisma/browser';

export const SELECT_BOARD_AUTHOR = {
  select: {
    id: true,
    nickname: true,
    profileImg: true,
  },
} satisfies Prisma.UserDefaultArgs;

export type SelectBoardAuthor = Prisma.UserGetPayload<
  typeof SELECT_BOARD_AUTHOR
>;
