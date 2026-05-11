import { SelectBoardOption } from './prisma/select-board-options';

export class BoardOptionEntity {
  /**
   * 선택지 식별자
   */
  idx: number;

  /**
   * 순서
   *
   * @example 1
   */
  sortOrder: number;

  /**
   * 게시판 선택지 내용
   *
   * @example "네 꼭 필요해요"
   */
  content: string;

  /**
   * 선택지 투표 수
   *
   * @example 10
   */
  count: number;

  constructor(data: BoardOptionEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(option: SelectBoardOption): BoardOptionEntity {
    return new BoardOptionEntity({
      idx: option.idx,
      sortOrder: option.sortOrder,
      content: option.contents,
      count: option.count,
    });
  }
}
