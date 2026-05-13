import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VoteService } from './vote.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { Exception } from '../../common/decorators/exception.decorator';
import { LoginUser, User } from '../../common/decorators/user.decorator';

@Controller()
@ApiTags('Vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('/board/:boardIdx/option/:optionIdx')
  @Exception(400, 'invalid boardIdx or optionIdx')
  @Exception(404, 'cannot find board or option')
  @Exception(409, 'already voted')
  @Auth()
  public async voteOptionOfBoard(
    @Param('boardIdx', ParseIntPipe) boardIdx: number,
    @Param('optionIdx', ParseIntPipe) optionIdx: number,
    @User() loginUser: LoginUser,
  ) {
    return await this.voteService.voteBoard(boardIdx, optionIdx, loginUser);
  }
}
