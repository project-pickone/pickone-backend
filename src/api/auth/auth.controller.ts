import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorators/exception.decorator';
import { LoginDto } from './dto/request/login.dto';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그아웃 API
   */
  @Post('/logout')
  @HttpCode(204)
  public async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie('accessToken', {
      sameSite: 'none',
      secure: true,
    });
  }

  /**
   * 로그인 API
   */
  @Post('/login')
  @Exception(400, 'invalid')
  public async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken } = await this.authService.login(dto);

    res.cookie('accessToken', accessToken, {
      sameSite: 'none',
      secure: true,
    });
  }
}
