import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign_in.provider';
import { SignInDto } from '../dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
