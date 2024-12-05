import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(id: number, email: string) {
    const payload = { sub: id, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateJwt(email: string) {
    const user = await this.usersService.user({ email });
    if (user) {
      return 'You are logged in';
    }
    return 'Unauthorized';
  }
  async validateUser(
    userEmail: string,
    userPassword: string,
  ): Promise<UserDTO | null> {
    const user = await this.usersService.user({ email: userEmail });
    //Checking if a user exists with the particular email submitted
    if (user) {
      const checkPassword = await bcrypt.compare(userPassword, user.password);
      if (checkPassword) {
        return user;
      }
    }
    return;
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
