import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
    constructor(private readonly usersService: UsersService) {}
  findAll(userId: string) {
    console.log(userId);
    const user = this.usersService.findByUserId(userId);
    return [
      {
        user,
        title: 'Post 1',
        content: 'This is the content of post 1',
      },
      {
        user,
        title: 'Post 2',
        content: 'This is the content of post 2',
      },
    ];
  }
}
