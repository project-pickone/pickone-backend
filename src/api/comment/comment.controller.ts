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
import { CommentService } from './comment.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { Exception } from '../../common/decorators/exception.decorator';
import { LoginUser, User } from '../../common/decorators/user.decorator';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { GetCommentAllRequestDto } from './dto/request/get-comment-all.dto';
import { GetCommentAllResponseDto } from './dto/response/get-comment-all-response.dto';
import { CommentEntity } from './entity/comment.entity';

@Controller('board/:boardIdx/comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 목록 조회 API
   */
  @Get()
  @Exception(400, 'invalid query parameter')
  @Exception(404, 'board not found')
  @Auth()
  public async getComments(
    @User() loginUser: LoginUser,
    @Param('boardIdx', ParseIntPipe) boardIdx: number,
    @Query() dto: GetCommentAllRequestDto,
  ): Promise<GetCommentAllResponseDto> {
    return await this.commentService.getCommentAll(boardIdx, dto, loginUser);
  }

  /**
   * 댓글 작성 API
   */
  @Post()
  @Exception(400, 'invalid body or optionIdx')
  @Exception(404, 'board not found')
  @Auth()
  public async createComment(
    @User() loginUser: LoginUser,
    @Param('boardIdx', ParseIntPipe) boardIdx: number,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return await this.commentService.createComment(boardIdx, dto, loginUser);
  }

  /**
   * 댓글 수정 API
   */
  @Put('/:commentIdx')
  @Exception(400, 'invalid body')
  @Exception(403, 'permission denied')
  @Exception(404, 'board or comment not found')
  @Auth()
  public async updateComment(
    @User() loginUser: LoginUser,
    @Param('boardIdx', ParseIntPipe) boardIdx: number,
    @Param('commentIdx', ParseIntPipe) commentIdx: number,
    @Body() dto: UpdateCommentDto,
  ): Promise<void> {
    return await this.commentService.updateComment(
      boardIdx,
      commentIdx,
      dto,
      loginUser,
    );
  }

  /**
   * 댓글 삭제 API
   */
  @Delete('/:commentIdx')
  @Exception(400, 'invalid path parameter')
  @Exception(403, 'permission denied')
  @Exception(404, 'board or comment not found')
  @Auth()
  public async deleteComment(
    @User() loginUser: LoginUser,
    @Param('boardIdx', ParseIntPipe) boardIdx: number,
    @Param('commentIdx', ParseIntPipe) commentIdx: number,
  ): Promise<void> {
    return await this.commentService.deleteComment(
      boardIdx,
      commentIdx,
      loginUser,
    );
  }
}
