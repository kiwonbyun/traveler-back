import { Injectable } from '@nestjs/common';
import { GptService } from './gpt/gpt.service';

@Injectable()
export class AppService {
  constructor(private readonly gptService: GptService) {}

  async getHello() {
    const result = await this.gptService.generateText([
      { content: 'Hello, what is your name?', role: 'user' },
    ]);
    return result;
  }
}
