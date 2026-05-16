import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Exception } from '../../common/decorators/exception.decorator';
import { SignupDto } from './dto/request/signup.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { LoginUser, User } from '../../common/decorators/user.decorator';
import { DuplicateCheckDto } from './dto/request/id-duplicate-check.dto';
import { UserEntity } from './entity/user.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 회원가입 API
   */
  @Post()
  @Exception(400, 'invalid body')
  @Exception(409, 'user already exists')
  public async signup(@Body() dto: SignupDto): Promise<UserEntity> {
    return await this.userService.signUp(dto);
  }

  /**
   * 내 정보 보기 API
   */
  @Get('me')
  @Auth()
  public async getMyInfo(@User() loginUser: LoginUser): Promise<UserEntity> {
    return await this.userService.getMyInfo(loginUser);
  }

  /**
   * 아이디 중복 확인 API
   */
  @Post('duplicate-check')
  public async checkIdDuplicate(
    @Body() dto: DuplicateCheckDto,
  ): Promise<boolean> {
    return !(await this.userService.checkIdDuplicate(dto)).isDuplicate;
  }
}
