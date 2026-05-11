import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountRepository } from '../user/account.repository';
import { LoginDto } from './dto/request/login.dto';
import { HashService } from '../../common/modules/hash/hash.service';
import { LoginTokenService } from '../../common/modules/login-token/login-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly hashService: HashService,
    private readonly loginTokenService: LoginTokenService,
  ) {}

  public async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const account = await this.accountRepository.selectAccountByUserId(
      loginDto.userId,
    );

    if (!account) throw new BadRequestException('invalid id');

    const isPasswordValid = await this.hashService.compare(
      loginDto.pw,
      account.pw,
    );

    if (!isPasswordValid) throw new BadRequestException('invalid password');

    return {
      accessToken: await this.loginTokenService.generateToken({
        id: account.id,
      }),
    };
  }
}
