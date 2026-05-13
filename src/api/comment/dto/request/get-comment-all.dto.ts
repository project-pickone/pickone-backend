import { Type } from 'class-transformer';

export class GetCommentAllRequestDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  page: number;
}
