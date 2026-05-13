import { Prisma } from '@generated/prisma/browser';

export const SELECT_COMMENT_AUTHOR = {
  select: {
    id: true,
    nickname: true,
    profileImg: true,
  },
} satisfies Prisma.UserDefaultArgs;

export type SelectCommentAuthor = Prisma.UserGetPayload<
  typeof SELECT_COMMENT_AUTHOR
>;
