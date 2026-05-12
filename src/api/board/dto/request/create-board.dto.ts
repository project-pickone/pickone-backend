import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBoardDto {
  /**
   * @example "삼권분립이 꼭 필요한가요?"
   */
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  title: string;

  /**
   * 게시글 내용
   *
   * @example "삼권 분립 어쩌구..."
   */
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  contents: string;

  /**
   * 첫 번째 선택지
   *
   * @example "네, 꼭 필요해요!"
   */
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstOption: string;

  /**
   * 두 번째 선택지
   *
   * @example "아니요, 필요하지 않아요!"
   */
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  secondOption: string;

  /**
   * 카테고리
   */
  @IsInt({ each: true })
  category: number[];
}
