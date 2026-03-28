import { DevMemConfig } from './config.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './prompts.js';

export interface AIClient {
  summarize(prompt: string, fileContents: string): Promise<string>;
}

function createGeminiClient(config: DevMemConfig): AIClient {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.model });

  return {
    async summarize(prompt: string, fileContents: string): Promise<string> {
      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: prompt },
        { text: `\n\n--- SOURCE FILES ---\n\n${fileContents}` },
      ]);
      return result.response.text();
    },
  };
}

function createOpenAIClient(config: DevMemConfig): AIClient {
  const client = new OpenAI({ apiKey: config.apiKey });

  return {
    async summarize(prompt: string, fileContents: string): Promise<string> {
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${prompt}\n\n--- SOURCE FILES ---\n\n${fileContents}` },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });
      return response.choices[0]?.message?.content ?? '';
    },
  };
}

function createAnthropicClient(config: DevMemConfig): AIClient {
  const client = new Anthropic({ apiKey: config.apiKey });

  return {
    async summarize(prompt: string, fileContents: string): Promise<string> {
      const response = await client.messages.create({
        model: config.model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `${prompt}\n\n--- SOURCE FILES ---\n\n${fileContents}` },
        ],
      });
      const block = response.content[0];
      return block.type === 'text' ? block.text : '';
    },
  };
}

export function createAIClient(config: DevMemConfig): AIClient {
  switch (config.provider) {
    case 'gemini':
      return createGeminiClient(config);
    case 'openai':
      return createOpenAIClient(config);
    case 'anthropic':
      return createAnthropicClient(config);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
