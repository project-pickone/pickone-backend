import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

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

  @IsString()
  @Optional()
  authorId?: string;

  /**
   * 사용자의 투표 여부
   */
  @Type(() => Number)
  @IsIn([1])
  @Optional()
  myVote?: 1;
}
