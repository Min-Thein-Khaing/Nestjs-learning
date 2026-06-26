import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UserData } from '../interfaces/userData.interface';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );
  }

  public async generateTokens(user: User) {
    // const accessToken = await this.signToken<Partial<UserData>>(
    //   user.id!,
    //   this.jwtConfiguration.expiresIn,
    //   { email: user.email },
    // );
    // const refreshToken = await this.signToken<Partial<UserData>>(
    //   user.id!,
    //   this.jwtConfiguration.refreshTokenTTL,
    // );
    // return { accessToken, refreshToken };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<UserData>>(
        user.id!,
        this.jwtConfiguration.expiresIn,
        { email: user.email },
      ),
      this.signToken<Partial<UserData>>(
        user.id!,
        this.jwtConfiguration.refreshTokenTTL,
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
