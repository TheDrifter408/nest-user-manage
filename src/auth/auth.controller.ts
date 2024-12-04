import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/dto/user.dto';
import { GoogleAuthGuard } from './googleAuth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Body() user: UserDTO) {
    return await this.authService.signIn(user.email, user.password);
  }

  //The guard is being used to execute the google strategy which calls the validate function
  //At first the /auth/google endpoint is hit which redirects the user to a different url and asks for authentication
  //After the user agrees the GoogleStrategy's 'validate' function then runs.
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google-redirect')
  googleRedirect() {
    return 'At controller: googleRedirect() function.';
  }
}
