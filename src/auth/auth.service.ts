import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, password: string): Promise<User | string> {
    const user = await this.usersService.user({ email: email });
    const UserOrNot = await bcrypt.compare(password, user.password);
    console.log(UserOrNot);
    if (UserOrNot) {
      return user;
    }
    return 'ERROR';
  }
}
