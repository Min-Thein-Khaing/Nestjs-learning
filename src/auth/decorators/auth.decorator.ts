import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enum/auth-type-enum';

export const AUTH_TYPE_KEY = 'auth';

export const Auth = (...args: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, args);
