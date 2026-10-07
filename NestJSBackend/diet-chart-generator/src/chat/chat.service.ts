import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor() {}

  getChatResponse(userInput: string): string {
    return `You said: ${userInput}`;
  }
}
