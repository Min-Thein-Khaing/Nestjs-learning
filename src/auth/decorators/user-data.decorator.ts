import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../interfaces/userData.interface';

export const User = createParamDecorator(
  (field: keyof UserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserData }>();
    const user = request.user;

    return field ? user[field] : user;
  },
);
