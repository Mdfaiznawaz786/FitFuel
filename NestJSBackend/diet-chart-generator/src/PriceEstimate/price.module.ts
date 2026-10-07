import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({ controllers: [PriceController], providers: [PriceService, JwtAuthGuard] })
export class PriceModule {}
