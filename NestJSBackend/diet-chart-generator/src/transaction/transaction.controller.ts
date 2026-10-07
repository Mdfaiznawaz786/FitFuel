/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('history')
  async getTransactionHistory(@Req() req) {
    console.log('User ID:', req.user);
    return await this.transactionService.getTransactionHistory(req.user.userid);
  }
}
