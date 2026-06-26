import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import { UserData } from '../interfaces/userData.interface';
import { GenerateTokenProvider } from './generate_token.provider';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    /** inject jwt config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,

    /** inject jwt service */
    private readonly jwtService: JwtService,

    /** inject user service */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /** inject generate provider */
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    //verify_refresh_Token
    let sub: number;
    try {
      const payload = await this.jwtService.verifyAsync<UserData>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      sub = payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    //get user from db
    const user = await this.usersService.findByUserId(sub);
    //generate new tokens
    return await this.generateTokensProvider.generateTokens(user);
  }
}
