import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../api/auth/auth.guard';
import { Exception } from './exception.decorator';

export const Auth = () =>
  applyDecorators(UseGuards(AuthGuard), Exception(401, 'no login'));
