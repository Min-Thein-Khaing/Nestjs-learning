import { SignInDto } from './../dtos/signIn.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate_token.provider';
// import jwtConfig from '../config/jwt.config';
// import * as config from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokens: GenerateTokenProvider,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    const passwordMatches = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password as string,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return await this.generateTokens.generateTokens(user);
  }
}
