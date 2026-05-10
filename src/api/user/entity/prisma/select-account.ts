import { Prisma } from '@generated/prisma/browser';

export const SELECT_ACCOUNT = {
  select: {
    id: true,
    userId: true,
    pw: true,
  },
} satisfies Prisma.AccountDefaultArgs;

export type SelectAccount = Prisma.AccountGetPayload<typeof SELECT_ACCOUNT>;
