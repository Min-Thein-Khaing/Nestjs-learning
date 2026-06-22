import { SignInDto } from './../dtos/signIn.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const existEmail = await this.usersService.findByEmail(signInDto.email);

    const passwordMatches = await this.hashingProvider.comparePassword(
      signInDto.password,
      existEmail.password as string,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Never expose the password hash in an API response.

    const accessToken = await this.jwtService.signAsync(
      {
        sub: existEmail.id,
        email: existEmail.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.expiresIn,
      },
    );

    return { accessToken };
  }
}
