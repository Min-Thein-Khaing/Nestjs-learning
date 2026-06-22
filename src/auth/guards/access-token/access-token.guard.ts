import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';

interface AccessTokenPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //get request from context
    const request = context.switchToHttp().getRequest<Request>();
    //get token from header request
    const token = this.getTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }
    //validation token
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      request['user'] = payload;
    } catch (error) {
      console.error(error); // 'error is defined but never used' မဖြစ်အောင် console ထုတ်ထားလိုက်ပါ
      throw new UnauthorizedException('Access token not found');
    }
    return true;
  }

  private getTokenFromHeader = (request: Request) => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}
