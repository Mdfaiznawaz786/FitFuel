import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { ShoppingRecordsService } from './shopping-records.service';

@Controller('shopping-records')
@UseGuards(JwtAuthGuard)
export class ShoppingRecordsController {
  constructor(private readonly records: ShoppingRecordsService) {}

  @Post()
  save(@Req() request: { user: { userid: string } }, @Body() body: { clientId?: string; store?: string; amountPaid?: number; date?: string; items?: { name: string; quantity: string }[] }) {
    return this.records.save(request.user.userid, body);
  }

  @Get()
  list(@Req() request: { user: { userid: string } }) {
    return this.records.list(request.user.userid);
  }
}
