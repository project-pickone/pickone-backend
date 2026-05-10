import { SelectUser } from './prisma/select-user';

export class UserEntity {
  public id: string;
  public nickname: string;
  public profileImage: string | null;
  public birth: Date;
  public createdAt: Date;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  public static fromPrisma(user: SelectUser): UserEntity {
    return new UserEntity({
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profileImg,
      birth: user.birth,
      createdAt: user.createdAt,
    });
  }
}
