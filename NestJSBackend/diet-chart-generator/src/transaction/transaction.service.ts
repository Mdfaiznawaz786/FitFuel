/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: SupabaseService) {}

  async getTransactionHistory(userId: string) {
    const { data, error } = await this.databaseService
      .getClient()
      .rpc('paymenthistory', {
        userid: userId,
      });
    if (error) {
      throw new Error(`Error fetching transaction history: ${error.message}`);
    }
    return data;
  }
}
