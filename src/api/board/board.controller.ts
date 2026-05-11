import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorators/exception.decorator';
import { LoginUser, User } from '../../common/decorators/user.decorator';
import { CreateBoardDto } from './dto/request/create-board.dto';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor() {}

  /**
   * 게시판 생성 API
   */
  @Post()
  @Exception(400, 'invalid body')
  public async createBoard(
    @User() loginUser: LoginUser,
    @Body() dto: CreateBoardDto,
  ) {}
}
