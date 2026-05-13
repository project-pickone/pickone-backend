import { IsString } from 'class-validator';

export class DuplicateCheckDto {
  /**
   * 확인할 아이디
   *
   * @example "user123"
   */
  @IsString()
  id: string;
}
