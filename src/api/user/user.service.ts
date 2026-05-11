import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignupDto } from './dto/request/signup.dto';
import { AccountRepository } from './account.repository';
import { Transactional } from '@nestjs-cls/transactional';
import { HashService } from '../../common/modules/hash/hash.service';
import { UserEntity } from './entity/user.entity';
import { LoginUser } from '../../common/decorators/user.decorator';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly hashService: HashService,
  ) {}

  @Transactional()
  public async signUp(dto: SignupDto): Promise<UserEntity> {
    const alreadyExist = await this.accountRepository.selectAccountByUserId(
      dto.userId,
    );

    if (alreadyExist) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    const user = await this.userRepository.insertUser(dto);
    await this.accountRepository.insertAccount(
      user.id,
      dto.userId,
      hashedPassword,
    );
    return UserEntity.fromPrisma(user);
  }

  public async getMyInfo(loginUser: LoginUser): Promise<UserEntity> {
    const user = await this.userRepository.selectUserById(loginUser.id);

    if (!user) {
      console.error(`User with ID ${loginUser.id} not found.`);
      throw new UnauthorizedException('invalid token');
    }

    return UserEntity.fromPrisma(user);
  }
}
