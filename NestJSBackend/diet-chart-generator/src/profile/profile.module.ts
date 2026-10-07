import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SupabaseService } from 'src/Database/database.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService, SupabaseService, JwtAuthGuard, ConfigService],
  exports: [],
  // Add any other necessary imports, controllers, and providers here
})
export class ProfileModule {}
