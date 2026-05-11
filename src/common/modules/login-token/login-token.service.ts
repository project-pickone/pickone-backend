import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginTokenPayload } from './login-token-payload.type';

@Injectable()
export class LoginTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 토큰 생성
   */
  public async generateToken(payload: LoginTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  /**
   * 토큰 검증
   */
  public async verifyToken(token: string): Promise<LoginTokenPayload> {
    return await this.jwtService.verifyAsync<LoginTokenPayload>(token);
  }
}
