import { IsString } from 'class-validator';

export class LoginDto {
  /**
   * 사용자 아이디
   *
   * @example "john_doe"
   */
  @IsString()
  userId: string;

  /**
   * 비밀번호
   *
   * @example "password123"
   */
  @IsString()
  pw: string;
}
