// gpt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

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

  async generateText(prompt: ChatCompletionMessageParam[]) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: prompt,
        max_tokens: 20,
        temperature: 0.9,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
