import { Module } from '@nestjs/common';
import { SupabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [SupabaseService, ConfigService],
  exports: [],
})
export class DatabaseModule {}
