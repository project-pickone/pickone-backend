import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MaxLength(20)
  @MinLength(7)
  public userId: string;

  @IsString()
  @MaxLength(8)
  @MinLength(2)
  public nickname: string;

  @IsOptional()
  @IsString()
  public profileImg: string | null;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  public password: string;

  // YYYY-MM-DD
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Birth must be in the format YYYY-MM-DD',
  })
  public birth: string;
}
