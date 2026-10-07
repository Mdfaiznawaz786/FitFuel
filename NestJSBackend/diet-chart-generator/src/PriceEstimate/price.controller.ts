import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { PriceService } from './price.service';

@Controller('price-estimates')
@UseGuards(JwtAuthGuard)
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  estimate(@Body() body: { names?: unknown }) {
    return this.priceService.estimate(body);
  }
}
