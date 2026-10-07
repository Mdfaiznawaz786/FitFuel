import { Module } from '@nestjs/common';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { SupabaseService } from 'src/Database/database.service';
import { ConfigService } from '@nestjs/config';
import { UserSpecificationService } from 'src/UserSpecifications/userspec.service';

@Module({
  imports: [],
  controllers: [DietController],
  providers: [
    DietService,
    JwtAuthGuard,
    SupabaseService,
    ConfigService,
    UserSpecificationService,
  ],
  exports: [],
})
export class DietModule {}
