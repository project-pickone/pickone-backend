import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginTokenService } from '../../common/modules/login-token/login-token.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly loginTokenService: LoginTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      return false;
    }

    try {
      const payload = await this.loginTokenService.verifyToken(accessToken);
      request['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
