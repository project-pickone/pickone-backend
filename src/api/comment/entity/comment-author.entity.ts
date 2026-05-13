import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';
import { SelectCommentAuthor } from './prisma/select-comment-author';

export class CommentAuthorEntity extends PickType(UserEntity, [
  'id',
  'nickname',
  'profileImage',
] as const) {
  constructor(data: CommentAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(user: SelectCommentAuthor): CommentAuthorEntity {
    return new CommentAuthorEntity({
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImg,
    });
  }
}
