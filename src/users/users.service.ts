import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
const SALTROUNDS = 10;
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  //Get a user
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  //get all users
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  //Create a user
  async createUser(data: Prisma.UserCreateInput): Promise<string> {
    try {
      const user = await this.user({
        email: data.email,
      });
      if (user !== null) {
        return 'This user already exists';
      }
    } catch (e: unknown) {
      throw new InternalServerErrorException('Could not query user', e);
    }
    const hashedPassword = bcrypt.hashSync(data.password, SALTROUNDS);
    data = {
      ...data,
      password: hashedPassword,
    };
    try {
      const newUser = this.prisma.user.create({
        data,
      });
      if (newUser) {
        return 'New User Created';
      }
    } catch (e: unknown) {
      throw new InternalServerErrorException('Could not create new user', e);
    }
  }

  //Update a user
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }
  //Delete a user
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
