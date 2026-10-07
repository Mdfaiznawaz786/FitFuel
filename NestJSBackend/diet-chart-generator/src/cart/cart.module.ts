import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';
import { CartController } from './cart.controller';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { ConfigService } from '@nestjs/config';
import { CartService } from './cart.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [SupabaseService, JwtAuthGuard, ConfigService, CartService],
  exports: [],
})
export class CartModule {}
