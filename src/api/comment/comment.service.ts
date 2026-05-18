import {
  BadRequestException,
  ConflictException,
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
import { VoteRepository } from '../vote/vote.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly boardRepository: BoardRepository,
    private readonly voteRepository: VoteRepository,
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
        await this.commentRepository.selectCommentAll(
          boardIdx,
          dto.page,
          loginUser.id,
        )
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

    const option = await this.voteRepository.selectVoteByBoardIdxAndUserId(
      loginUser.id,
      board.idx,
    );

    if (!option) {
      throw new ConflictException(
        '투표에 참여한 사용자만 댓글을 작성할 수 있습니다.',
      );
    }

    const comment = await this.commentRepository.insertComment(
      boardIdx,
      option.optionIdx,
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

  // ── Like ───────────────────────────────────────────────────────────────

  public async likeComment(
    commentIdx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const [existingLike, existingDislike] = await Promise.all([
      this.commentRepository.selectCommentLike(commentIdx, loginUser.id),
      this.commentRepository.selectCommentDislike(commentIdx, loginUser.id),
    ]);

    if (existingLike) {
      throw new ConflictException('이미 좋아요한 댓글입니다.');
    }

    if (existingDislike) {
      throw new BadRequestException('싫어요한 댓글에는 좋아요할 수 없습니다.');
    }

    await this.commentRepository.insertCommentLike(commentIdx, loginUser.id);
  }

  public async unlikeComment(
    commentIdx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const existingLike = await this.commentRepository.selectCommentLike(
      commentIdx,
      loginUser.id,
    );

    if (!existingLike) {
      throw new NotFoundException('좋아요하지 않은 댓글입니다.');
    }

    await this.commentRepository.deleteCommentLike(commentIdx, loginUser.id);
  }

  // ── Dislike ────────────────────────────────────────────────────────────

  public async dislikeComment(
    commentIdx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const [existingDislike, existingLike] = await Promise.all([
      this.commentRepository.selectCommentDislike(commentIdx, loginUser.id),
      this.commentRepository.selectCommentLike(commentIdx, loginUser.id),
    ]);

    if (existingDislike) {
      throw new ConflictException('이미 싫어요한 댓글입니다.');
    }

    if (existingLike) {
      throw new BadRequestException('좋아요한 댓글에는 싫어요할 수 없습니다.');
    }

    await this.commentRepository.insertCommentDislike(commentIdx, loginUser.id);
  }

  public async undislikeComment(
    commentIdx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const comment = await this.commentRepository.selectCommentByIdx(commentIdx);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const existingDislike = await this.commentRepository.selectCommentDislike(
      commentIdx,
      loginUser.id,
    );

    if (!existingDislike) {
      throw new NotFoundException('싫어요하지 않은 댓글입니다.');
    }

    await this.commentRepository.deleteCommentDislike(commentIdx, loginUser.id);
  }
}
