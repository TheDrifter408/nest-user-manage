import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(
    userEmail: string,
    userPassword: string,
  ): Promise<User | string> {
    const user = await this.usersService.user({ email: userEmail });
    //Checking if a user exists with the particular email submitted
    if (user) {
      const UserOrNot = await bcrypt.compare(userPassword, user.password);
      if (UserOrNot) {
        return user;
      }
    }
    return 'No User Found';
  }

  async register(user: UserDTO): Promise<string> {
    let newUser = null;
    try {
      newUser = await this.usersService.createUser({
        email: user.email,
        password: user.password,
      });
      return newUser;
    } catch (e: unknown) {
      throw new InternalServerErrorException(e);
    }
  }
}
