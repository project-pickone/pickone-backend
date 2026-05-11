import { BoardAuthorEntity } from './board-author.entity';
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
      options: board.options.map((option) =>
        BoardOptionEntity.fromPrisma(option),
      ),
      createdAt: board.createdAt,
    });
  }
}
