import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../api/auth/auth.guard';

export const Auth = () => applyDecorators(UseGuards(AuthGuard));
