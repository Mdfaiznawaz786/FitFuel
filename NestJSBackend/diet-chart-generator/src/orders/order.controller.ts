/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  // Define the constructor and any necessary dependencies here
  constructor(private readonly orderService: OrderService) {}

  @Get('order-confirmation/:id')
  async getOrderConfirmation(@Req() req: any, @Param('id') id: string) {
    return await this.orderService.getOrderConfirmation(id);
  }

  @Get('order-history')
  async getOrderHistory(@Req() req: any) {
    //console.log('User ID:', req.user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return await this.orderService.getOrderHistory(req.user.userid);
  }

  @Patch('update-order-status/:id')
  async updateOrderStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.orderService.updateOrderStatus(id, status);
  }
  // Define your controller methods here
  // For example, you might have a method to create an order
}
