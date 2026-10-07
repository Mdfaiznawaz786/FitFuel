import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [SupabaseService, OrderService, JwtAuthGuard, ConfigService],
})
export class OrderModule {}
