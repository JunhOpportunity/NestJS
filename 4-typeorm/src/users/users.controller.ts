import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.usersService.getAllUsers();
  }

  // @Post()
  // postUser(
  //   @Body() body: any,
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   console.log('--- 수신 데이터 확인 ---');
  //   console.log('전체 Body:', body);
  //   console.log('email:', email);
  //   return this.usersService.createUser({nickname, email, password});
  // }
}
