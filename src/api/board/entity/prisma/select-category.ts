import { Prisma } from '@generated/prisma/browser';

export const SELECt_CATEGORY = {
  select: {
    idx: true,
    name: true,
  },
} satisfies Prisma.CategoryDefaultArgs;

export type SelectCategory = Prisma.CategoryGetPayload<typeof SELECt_CATEGORY>;
