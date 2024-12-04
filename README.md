<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Implementing Authentication: 
NestJS is built on top of express thus we can treat it almost as express itself. NestJS provides code organization, a powerful CLI and an opinionated way that encourages SOLID principles. They have a comprehensive guide on to use their CLI to start scaffolding route handlers, using controllers, services and modules.

We use the following the command which creates an 'auth' folder containing, a controller, service and module to make it easier to write our logic.
```bash
nest g module auth
```
## The 'auth' Folder:
To properly implement OAuth we have to make use of Nest's reccomended auth framework which is **PassportJS**.
PassportJS has modules that lets us as the developer to implement the Authentication **Strategies** that we want. For example to implement local authentication that just checks the user's input password we do the following:

```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<User | string> {
    console.log(email, password);
    const user = await this.authService.signIn(email, password);
    if (!user) {
      return `Unauthorized or doesn't exist`;
    }
    return user;
  }
}
```
Following NestJS's convention of using OOP principles we create a class `LocalStrategy` that extends **PassportJS'** own **Strategy**. We then pass our own custom defined `AuthService` so that this Strategy can make use of it's methods.

The `AuthService` is the following:

```typescript
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
```
The `AuthService` inturn needs to make use of the `UsersService` service which is makes use of the `PrismaService` to make read/write operations with the database possible.

<div style="background-color: #6c757d; padding: 16px; border-radius: 8px; margin: 10px 0px;">
<h2>Note</h2>
<p style="font-size:16px; color:#FFFF;">Per NestJS's own reccomendations it is best implement external features or external apis as <code>Services</code>. For example, since we have to make frequent calls to our database it is best to implement it as a <code>Service</code>. There is a <code>.service.ts</code> at the root of our source folder that initializes the connection with our database.</p>
</div>

To make sure we are using the `LocalStrategy` we just defined we can make use of NestJS' [guards](https://docs.nestjs.com/guards) feature.

