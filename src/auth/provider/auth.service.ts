import { UsersService } from './../../users/providers/users.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly UsersService: UsersService,
  ) {}

  login(email: string, password: string, id: string) {
    const user = this.UsersService.findByUserId(id);
    return 'Token';
  }

  public isAuth() {
    return true;
  }
}
