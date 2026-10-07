import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  // Add your methods and logic here
  // For example, you can define endpoints for user profile management
  constructor(private readonly profileService: ProfileService) {}

  @Get('get-profile')
  async getProfile(@Req() req: any) {
    return await this.profileService.getProfile(req.user.userid);
  }

  @Patch('update-profile')
  async updateProfile(@Req() req: any, @Body() profileData: any) {
    return await this.profileService.updateProfile(
      profileData,
      req.user.userid,
    );
  }

  @Get('weight-history')
  async getWeightHistory(@Req() req: any) {
    return await this.profileService.getWeightHistory(req.user.userid);
  }
}
