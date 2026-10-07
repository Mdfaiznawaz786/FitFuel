import { Module } from '@nestjs/common';
import { UserSpecificationController } from './userspec.controller';
import { UserSpecificationService } from './userspec.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { SupabaseService } from 'src/Database/database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [UserSpecificationController],
  providers: [UserSpecificationService, JwtAuthGuard, SupabaseService, ConfigService],
  exports: [],
})
export class UserSpecificationModule {}
