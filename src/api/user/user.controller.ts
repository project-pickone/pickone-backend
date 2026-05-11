import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Exception } from '../../common/decorators/exception.decorator';
import { SignupDto } from './dto/request/signup.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 회원가입
   */
  @Post()
  @Exception(400, 'invalid body')
  @Exception(409, 'user already exists')
  public async signup(@Body() dto: SignupDto) {
    return await this.userService.signUp(dto);
  }
}
