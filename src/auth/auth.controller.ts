import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './provider/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string; id: number }) {
    return this.authService.login(body.email, body.password, body.id);
  }
}
