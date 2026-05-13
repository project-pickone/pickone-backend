import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  /**
   * 수정할 댓글 내용
   *
   * @example "생각해보니 두 번째 선택지가 더 맞는 것 같습니다."
   */
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  contents: string;
}
