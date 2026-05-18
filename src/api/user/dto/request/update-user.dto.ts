import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';

export class UpdateUserDto extends PickType(SignupDto, [
  'nickname',
  'profileImg',
] as const) {}
