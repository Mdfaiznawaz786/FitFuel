import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from 'src/Database/database.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { ShoppingRecordsController } from './shopping-records.controller';
import { ShoppingRecordsService } from './shopping-records.service';

@Module({ controllers: [ShoppingRecordsController], providers: [ShoppingRecordsService, JwtAuthGuard, SupabaseService, ConfigService] })
export class ShoppingRecordsModule {}
