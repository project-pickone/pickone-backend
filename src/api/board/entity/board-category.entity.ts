import { SelectCategory } from './prisma/select-category';

export class BoardCategoryEntity {
  /**
   * 카테고리 식별자
   *
   * @example 1
   */
  idx: number;

  /**
   * 카테고리 이름
   *
   * @example "정치"
   */
  name: string;

  constructor(data: BoardCategoryEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(category: SelectCategory): BoardCategoryEntity {
    return new BoardCategoryEntity({
      idx: category.idx,
      name: category.name,
    });
  }
}
