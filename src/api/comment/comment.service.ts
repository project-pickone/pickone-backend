import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { BoardRepository } from '../board/board.repository';
import { LoginUser } from '../../common/decorators/user.decorator';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { GetCommentAllRequestDto } from './dto/request/get-comment-all.dto';
import { CommentEntity } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public async getCommentAll(
    boardIdx: number,
    dto: GetCommentAllRequestDto,
    loginUser: LoginUser,
  ) {
    const board = await this.boardRepository.selectBoardByIdx(
      boardIdx,
      loginUser.id,
    );

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return {
      commentList: (
        await this.commentRepository.selectCommentAll(boardIdx, dto.page)
      ).map(CommentEntity.fromPrisma),
      count: await this.commentRepository.selectCommentCount(boardIdx),
    };
  }

  public async createComment(
    boardIdx: number,
    dto: CreateCommentDto,
    loginUser: LoginUser,
  ): Promise<CommentEntity> {
    const board = await this.boardRepository.selectBoardByIdx(
      boardIdx,
      loginUser.id,
    );

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (board.options.findIndex((option) => option.idx === dto.optionIdx) === -1) {
      throw new BadRequestException('유효하지 않은 옵션입니다.');
    }

    const comment = await this.commentRepository.insertComment(
      boardIdx,
      dto.optionIdx,
      loginUser.id,
      dto.contents,
    );

    return CommentEntity.fromPrisma(comment);
  }

  public async updateComment(
    boardIdx: number,
    commentIdx: number,
    dto: UpdateCommentDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const board = await this.boardRepository.selectBoardByIdx(boardIdx);

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== loginUser.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.commentRepository.updateCommentByIdx(commentIdx, dto.contents);
  }

  public async deleteComment(
    boardIdx: number,
    commentIdx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const board = await this.boardRepository.selectBoardByIdx(boardIdx);

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== loginUser.id) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.commentRepository.deleteCommentByIdx(commentIdx, boardIdx);
  }
}
