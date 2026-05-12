import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class GetBoardAllRequestDto {
  /**
   * 페이지 번호
   *
   * @example 1
   */
  @Type(() => Number)
  page: number;

  /**
   * 카테고리
   *
   * @example 1
   */
  @Type(() => Number)
  @Optional()
  category?: number;
}
