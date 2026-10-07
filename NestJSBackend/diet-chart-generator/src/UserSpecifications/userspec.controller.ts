import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserSpecificationService } from './userspec.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';

@Controller('userspec')
@UseGuards(JwtAuthGuard)
export class UserSpecificationController {
  constructor(private readonly userspecService: UserSpecificationService) {}

  @Post('createUserSpecification/:dietId')
  async createUserSpecification(
    @Param('dietId') dietId: string,
    @Body() body: any,
  ): Promise<any> {
    return this.userspecService.createUserSpecification(dietId, body);
  }
  @Get('getUserSpecification/:dietId')
  async getUserSpecification(@Param('dietId') dietId: string): Promise<any> {
    return await this.userspecService.getUserSpecificationByDietId(dietId);
  }
  @Patch('updateUserSpecification/:dietId')
  async updateUserSpecification(
    @Param('dietId') dietId: string,
    @Body() body: any,
  ): Promise<any> {
    return this.userspecService.updateUserSpecification(dietId, body);
  }
  @Delete('deleteUserSpecification/:dietId')
  async deleteUserSpecification(@Param('dietId') dietId: string): Promise<any> {
    return this.userspecService.deleteUserSpecification(dietId);
  }
}
