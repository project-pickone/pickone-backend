import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';
import { SelectBoardAuthor } from './prisma/select-board-author';

export class BoardAuthorEntity extends PickType(UserEntity, [
  'id',
  'nickname',
  'profileImage',
] as const) {
  constructor(data: BoardAuthorEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(user: SelectBoardAuthor): BoardAuthorEntity {
    return new BoardAuthorEntity({
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImg,
    });
  }
}
