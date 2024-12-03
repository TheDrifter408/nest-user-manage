import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.users({
      where: {
        email: email,
      },
    });
  }
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.user({ id: Number(id) });
  }
  @Post()
  async createUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<User> {
    return this.usersService.createUser(userData);
  }
}
