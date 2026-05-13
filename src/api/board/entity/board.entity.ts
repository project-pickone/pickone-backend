import { BoardAuthorEntity } from './board-author.entity';
import { BoardCategoryEntity } from './board-category.entity';
import { BoardOptionEntity } from './board-option.entity';
import { SelectBoard } from './prisma/select-board';

export class BoardEntity {
  /**
   * 게시판 식별자
   *
   * @example 1
   */
  idx: number;

  author: BoardAuthorEntity;

  /**
   * 게시글 제목
   *
   * @example "삼권분립이 꼭 필요한가요?"
   */
  title: string;

  /**
   * 게시글 내용
   *
   * @example "삼권 분립 어쩌구..."
   */
  contents: string;

  options: BoardOptionEntity[];

  categoryList: BoardCategoryEntity[];

  /**
   * 댓글 수
   *
   * @example 123
   */
  commentCount: number;

  createdAt: Date;

  constructor(data: BoardEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(board: SelectBoard): BoardEntity {
    return new BoardEntity({
      idx: board.idx,
      author: BoardAuthorEntity.fromPrisma(board.author),
      title: board.snapshots[0].title,
      contents: board.snapshots[0].contents,
      commentCount: board.commentCount,
      options: board.options.map((option) =>
        BoardOptionEntity.fromPrisma(option),
      ),
      createdAt: board.createdAt,
      categoryList: board.categories.map(({ category }) =>
        BoardCategoryEntity.fromPrisma(category),
      ),
    });
  }
}
