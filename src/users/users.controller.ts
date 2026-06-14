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
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  //   @Get()
  //   public getUsers() {
  //     return 'Get All User endpoints';
  //   }
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of users to return',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  public getAllUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched user' })
  getUserById(@Param() getUserDto: GetUserDto) {
    return this.usersService.findByUserId(getUserDto.id);
  }

  // @Get('filter')
  // getFilteredUsers(
  //   @Query('age', new DefaultValuePipe(10), ParseIntPipe) age: number,
  //   @Query('name', new DefaultValuePipe('test')) name: string,
  // ) {
  //   console.log(age, name);
  //   return `Get Filtered Users by age endpoint ${age} and name endpoint ${name}`;
  // }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put()
  public updateUser(@Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return 'Update User endpoint';
  }
}
