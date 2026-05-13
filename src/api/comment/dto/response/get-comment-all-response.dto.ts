import { CommentEntity } from '../../entity/comment.entity';

export class GetCommentAllResponseDto {
  commentList: CommentEntity[];
  count: number;
}
