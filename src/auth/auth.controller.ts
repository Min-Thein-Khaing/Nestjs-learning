import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './provider/auth.service';
import { SignInDto } from './dtos/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
