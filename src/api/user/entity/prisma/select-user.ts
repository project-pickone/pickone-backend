import { Prisma } from '@generated/prisma/browser';

export const SELECT_USER = {
  select: {
    id: true,
    nickname: true,
    birth: true,
    profileImg: true,
    createdAt: true,
    gender: true,
  },
} satisfies Prisma.UserDefaultArgs;

export type SelectUser = Prisma.UserGetPayload<typeof SELECT_USER>;
