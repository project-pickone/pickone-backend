import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetCommentAllRequestDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  page: number;
}
