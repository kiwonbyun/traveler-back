// gpt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { mockRestaurant } from 'src/mock/restaurant';

@Injectable()
export class GptService {
  private openai: OpenAI;
  constructor(private configService: ConfigService) {
    const configuration = {
      apiKey: configService.get('OPENAI_API_KEY'),
      organization: configService.get('OPENAI_ORGANIZATION'),
    };
    this.openai = new OpenAI(configuration);
  }

  getRestaurantsFormat(): string {
    const result = mockRestaurant.reduce((prev, curr, index) => {
      if (index === mockRestaurant.length - 1) {
        return `${prev} 식당이름:${curr.title}, 식당주소:${curr.address}, 식당연락처:${curr.phone}, 가격:${curr.price}; 모든 데이터 딘위는 세미콜론(;)으로 구분합니다.`;
      }
      return `${prev} 식당이름:${curr.title}, 식당주소:${curr.address}, 식당연락처:${curr.phone}, 가격:${curr.price};`;
    }, '');
    return result;
  }

  async generateText(prompt: ChatCompletionMessageParam[]) {
    try {
      const restaurants = this.getRestaurantsFormat();
      const newContent = restaurants + prompt[0].content;
      const newPrompt = [...prompt];
      newPrompt[0].content = newContent;
      console.log(newPrompt);
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_API_MODEL'),
        messages: newPrompt,
        max_tokens: 100,
        temperature: 0,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
