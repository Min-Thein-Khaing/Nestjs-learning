import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/provider/auth.service';

/**
 *  class to connect to users table and make business tasks
 */
@Injectable()
export class UsersService {
  /** to inject auth service */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /** to get all users */
  findAll(limit: number, page: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      { id: '1', name: 'John Doe', email: 'h9M4y@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
      limit,
      page,
    ];
  }
  /**
   * to get user by id
   * @param userId
   * @returns
   */
  findByUserId(userId: string) {
    console.log(userId);
    return { id: userId, name: 'John Doe', email: 'h9M4y@example.com' };
  }
}
