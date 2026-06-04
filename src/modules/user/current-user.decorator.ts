import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/types/auth-user.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    console.log(user);
    return data ? (user?.[data] as AuthUser[keyof AuthUser] | undefined) : user;
  },
);
