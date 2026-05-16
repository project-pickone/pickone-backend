import { Prisma } from '@generated/prisma/browser';
import { SELECT_BOARD_AUTHOR } from './select-board-author';
import { SELECT_BOARD_OPTIONS } from './select-board-options';
import { SELECt_CATEGORY } from './select-category';

export const SELECT_BOARD_OVERVIEW = (loginUserId?: string) =>
  ({
    select: {
      idx: true,
      commentCount: true,
      author: {
        select: SELECT_BOARD_AUTHOR.select,
      },
      snapshots: {
        select: {
          title: true,
          thumbnailPath: true,
        },
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      },
      createdAt: true,
      options: {
        select: SELECT_BOARD_OPTIONS(loginUserId).select,
        orderBy: {
          sortOrder: 'asc',
        },
      },
      categories: {
        select: {
          category: {
            select: SELECt_CATEGORY.select,
          },
        },
      },
    },
  }) satisfies Prisma.BoardDefaultArgs;

type SelectBoardOverviewArgs = ReturnType<typeof SELECT_BOARD_OVERVIEW>;

export type SelectBoardOverview =
  Prisma.BoardGetPayload<SelectBoardOverviewArgs>;
