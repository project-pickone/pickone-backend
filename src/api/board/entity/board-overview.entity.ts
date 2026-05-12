import { PickType } from '@nestjs/swagger';
import { BoardEntity } from './board.entity';
import { BoardAuthorEntity } from './board-author.entity';
import { SelectBoardOverview } from './prisma/select-board-overview';
import { BoardOptionEntity } from './board-option.entity';
import { BoardCategoryEntity } from './board-category.entity';

export class BoardOverviewEntity extends PickType(BoardEntity, [
  'idx',
  'author',
  'title',
  'options',
  'categoryList',
  'createdAt',
] as const) {
  constructor(data: BoardOverviewEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(board: SelectBoardOverview): BoardOverviewEntity {
    return new BoardOverviewEntity({
      idx: board.idx,
      author: BoardAuthorEntity.fromPrisma(board.author),
      title: board.snapshots[0].title,
      options: board.options.map((option) =>
        BoardOptionEntity.fromPrisma(option),
      ),
      categoryList: board.categories.map(({ category }) =>
        BoardCategoryEntity.fromPrisma(category),
      ),
      createdAt: board.createdAt,
    });
  }
}
