import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign_in.provider';
import { SignInDto } from '../dtos/signIn.dto';
import { RefreshTokenProvider } from './refresh-token.provider';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    /** inject sign in provider */
    private readonly signInProvider: SignInProvider,

    /** inject refresh token provider */
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }

  public refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
