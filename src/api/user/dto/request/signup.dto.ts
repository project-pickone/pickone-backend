import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  /**
   * @example "user1234"
   */
  @IsString()
  @MaxLength(20)
  @MinLength(7)
  public userId: string;

  /**
   * @example "jochong"
   */
  @IsString()
  @MaxLength(8)
  @MinLength(2)
  public nickname: string;

  @IsOptional()
  @IsString()
  public profileImg: string | null;

  /**
   * @example "password123"
   */
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  public password: string;

  /**
   * YYYY-MM-DD
   *
   * @example "2002-06-15"
   */
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Birth must be in the format YYYY-MM-DD',
  })
  public birth: string;
}
