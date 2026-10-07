/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() loginDto: any) {
    try {
      const result = await this.authService.signup(loginDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    try {
      await this.authService.logout(refreshToken);
      return { message: 'Logout successful' };
    } catch (error) {
      throw error;
    }
  }
}
