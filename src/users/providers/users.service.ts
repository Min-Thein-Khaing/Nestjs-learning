import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/provider/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  findAll() {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      { id: '1', name: 'John Doe', email: 'h9M4y@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];
  }
  findByUserId(userId: string) {
    console.log(userId);
    return { id: userId, name: 'John Doe', email: 'h9M4y@example.com' };
  }
}
