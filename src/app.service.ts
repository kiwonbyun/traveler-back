import { Injectable } from '@nestjs/common';
import { GptService } from './gpt/gpt.service';

@Injectable()
export class AppService {
  constructor(private readonly gptService: GptService) {}

  async getHello() {
    const result = await this.gptService.generateText([
      {
        content: '인천에서 가장 가까운 식당을 골라줘, 짧게 단어로 알려줘',
        role: 'user',
      },
    ]);
    return result;
  }
}
