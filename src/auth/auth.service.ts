import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(
    userEmail: string,
    userPassword: string,
  ): Promise<User | string> {
    console.log('Service: ', { userEmail, userPassword });
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
}
