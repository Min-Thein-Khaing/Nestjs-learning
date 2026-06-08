import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { GetUserDto } from './dtos/get.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';

@Controller('users')
export class UsersController {
  //   @Get()
  //   public getUsers() {
  //     return 'Get All User endpoints';
  //   }
  @Get(':id')
  getUserById(@Param() getUserDto: GetUserDto) {
    console.log(getUserDto);
    return `Get User by ID endpoint`;
  }

  @Get('filter')
  getFilteredUsers(
    @Query('age', new DefaultValuePipe(10), ParseIntPipe) age: number,
    @Query('name', new DefaultValuePipe('test')) name: string,
  ) {
    console.log(age, name);
    return `Get Filtered Users by age endpoint ${age} and name endpoint ${name}`;
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'User created successfully';
  }

  @Put()
  public updateUser(@Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return 'Update User endpoint';
  }
}
