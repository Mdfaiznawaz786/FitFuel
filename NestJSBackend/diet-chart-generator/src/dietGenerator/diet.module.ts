import { Module } from '@nestjs/common';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';

@Module({
  imports: [],
  controllers: [DietController],
  providers: [DietService, JwtAuthGuard],
  exports: [],
})
export class DietGeneratorModule {}
