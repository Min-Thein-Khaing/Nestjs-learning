import { GenerateTokenProvider } from './../provider/generate_token.provider';
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as config from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from './dto/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient!: OAuth2Client;

  constructor(
    /**inject jwt config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    /**inject user service */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /** inject generate token provider */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }
  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      //verify google token
      const googleTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      console.log(googleTicket);
      //extract payload from token
      // const { email, sub: googleId ,given_name:firstName , family_name:lastName } = googleTicket.getPayload();
      const payload = googleTicket.getPayload();
      console.log(payload);
      if (!payload?.sub) {
        throw new Error('Invalid Google token payload');
      }
      //find user with googleId
      const user = await this.usersService.findOneByGoogleId(payload.sub);
      //if googleId ok ,generate token , done

      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      }
      //if googleId not ok , create user and generate token
      const newUser = await this.usersService.createUserGoogle({
        googleId: payload.sub,
        email: payload.email!,
        firstName: payload.given_name!,
        lastName: payload.family_name!,
      });
      return this.generateTokenProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    //if something wrong , throw error or unauthorization
  }
}
