import { Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './googleAuth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user['id'], req.user['email']);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return `Hi ${req.user['email']} you are in your profile`;
  }
  //The guard is being used to execute the google strategy which calls the validate function
  //At first the /auth/google endpoint is hit which redirects the user to a different url and asks for authentication
  //After the user agrees the GoogleStrategy's 'validate' function then runs.
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google-redirect')
  googleRedirect(@Req() req: Request) {
    return `Hi, ${req.user['name']}`;
  }
}
