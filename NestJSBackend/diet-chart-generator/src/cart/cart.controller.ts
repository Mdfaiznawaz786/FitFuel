/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('order')
  async createOrder(@Body() orderData: any) {
    console.log('Received order data:', orderData);
    return await this.cartService.createOrder(orderData);
  }
  // Define your cart-related endpoints here
  // For example, add to cart, remove from cart, get cart items, etc.

  @Get('upcoming-deliveries')
  async getUpcomingDeliveries(@Req() req: any) {
    return await this.cartService.getUpcomingDeliveries(req.user.userid);
  }
}
