import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UserDTO } from 'src/dto/user.dto';

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
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.user({ id: id });
  }
  @Post()
  async createUser(@Body() userData: UserDTO): Promise<User | string> {
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
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
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
