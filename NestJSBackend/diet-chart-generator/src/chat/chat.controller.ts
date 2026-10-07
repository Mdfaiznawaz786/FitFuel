import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authGaurd/jwt-authgaurd';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor() {}
}
