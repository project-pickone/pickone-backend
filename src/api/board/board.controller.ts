import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorators/exception.decorator';
import { LoginUser, User } from '../../common/decorators/user.decorator';
import { CreateBoardDto } from './dto/request/create-board.dto';
import { BoardService } from './board.service';
import { BoardEntity } from './entity/board.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { GetBoardAllRequestDto } from './dto/request/get-board-all.dto';
import { GetBoardAllResponseDto } from './dto/response/get-board-all-response.dto';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * 게시판 목록보기 API
   */
  @Get()
  @Exception(400, 'invalid query parameter')
  @Auth()
  public async getBoards(
    @User() loginUser: LoginUser,
    @Query() dto: GetBoardAllRequestDto,
  ): Promise<GetBoardAllResponseDto> {
    return await this.boardService.getBoardAll(dto, loginUser);
  }

  /**
   * 게시판 생성 API
   */
  @Post()
  @Exception(400, 'invalid body')
  @Auth()
  public async createBoard(
    @User() loginUser: LoginUser,
    @Body() dto: CreateBoardDto,
  ): Promise<BoardEntity> {
    return await this.boardService.createBoard(loginUser, dto);
  }

  /**
   * 게시판 수정 API
   */
  @Put('/:idx')
  @Exception(400, 'invalid body')
  @Exception(403, 'permission denied')
  @Exception(404, 'board not found')
  @Auth()
  public async updateBoard(
    @User() loginUser: LoginUser,
    @Body() dto: CreateBoardDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.boardService.updateBoardByIdx(idx, dto, loginUser);
  }

  /**
   * 게시판 삭제 API
   */
  @Delete('/:idx')
  @Exception(400, 'invalid path parameter')
  @Exception(403, 'permission denied')
  @Exception(404, 'board not found')
  @Auth()
  public async deleteBoard(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.boardService.deleteBoardByIdx(idx, loginUser);
  }
}
