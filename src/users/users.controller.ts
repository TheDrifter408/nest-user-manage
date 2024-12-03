import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
    @Body() userData: { name?: string; email: string; password: string },
  ): Promise<User | string> {
    if (!userData.password) {
      return 'You must enter a password';
    }
    return this.usersService.createUser(userData);
  }
  @Put()
  async updateUser(
    @Query('email') email: string,
    @Query('password') password: string,
  ): Promise<User> {
    return this.usersService.updateUser({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    const user = await this.getUserById(id);
    if (user) {
      this.usersService.deleteUser({
        id: Number(id),
      });
      return `successfully deleted user no.${id}`;
    }
    return `There's no user no. ${id}`;
  }
}
