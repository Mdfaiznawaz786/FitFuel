import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';
import { TransactionService } from './transaction.service';
import { SupabaseService } from 'src/Database/database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [JwtAuthGuard, TransactionService, SupabaseService, ConfigService],
  exports: [],
  // Add any other necessary imports, controllers, and providers here
})
export class TransactionModule {}
