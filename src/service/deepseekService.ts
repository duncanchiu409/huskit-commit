import OpenAI from "openai";
import { generate_commit_message_prompt } from "../prompt";

type DeepSeekModels = "deepseek-chat" | "deepseek-reasoner";

class DeepSeekService {
  private selectedModel: DeepSeekModels;
  private openai: OpenAI;

  constructor(model: DeepSeekModels) {
    this.selectedModel = model;
    this.openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }

  async chat_completions(commitMessage: string, diff: string) {
    const response = await this.openai.chat.completions.create({
      model: this.selectedModel,
      messages: [
        {
          role: "user",
          content: generate_commit_message_prompt(commitMessage, diff),
        },
      ],
    });

    return response.choices[0].message.content;
  }
}

export default DeepSeekService;
