import { CommentAuthorEntity } from './comment-author.entity';
import { SelectComment } from './prisma/select-comment';

export class CommentEntity {
  /**
   * 댓글 식별자
   *
   * @example 1
   */
  idx: number;

  author: CommentAuthorEntity;

  /**
   * 댓글 내용
   *
   * @example "저는 첫 번째 선택지에 동의합니다."
   */
  contents: string;

  /**
   * 선택한 옵션 식별자
   *
   * @example 1
   */
  optionIdx: number;

  /**
   * 좋아요 수
   *
   * @example 12
   */
  likeCount: number;

  /**
   * 싫어요 수
   *
   * @example 3
   */
  dislikeCount: number;

  /**
   * 내가 좋아요 했는지 여부
   *
   * @example false
   */
  isLiked: boolean;

  /**
   * 내가 싫어요 했는지 여부
   *
   * @example false
   */
  isDisliked: boolean;

  createdAt: Date;

  constructor(data: CommentEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(comment: SelectComment): CommentEntity {
    return new CommentEntity({
      idx: comment.idx,
      author: CommentAuthorEntity.fromPrisma(comment.author),
      contents: comment.snapshots[0].contents,
      optionIdx: comment.optionIdx,
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
      isLiked: comment.likes.length > 0,
      isDisliked: comment.dislikes.length > 0,
      createdAt: comment.createdAt,
    });
  }
}
