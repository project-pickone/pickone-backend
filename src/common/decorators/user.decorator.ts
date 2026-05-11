import { createParamDecorator } from '@nestjs/common';
import { LoginTokenPayload } from '../modules/login-token/login-token-payload.type';

export const User = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return {
    id: (request.user as LoginTokenPayload).id,
  } satisfies LoginTokenPayload;
});

export class LoginUser {
  id: string;
}
