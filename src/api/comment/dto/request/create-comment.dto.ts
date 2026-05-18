import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  /**
   * 댓글 내용
   *
   * @example "저는 첫 번째 선택지에 동의합니다."
   */
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  contents: string;
}
