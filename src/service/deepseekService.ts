import OpenAI from "openai";

export type DeepSeekModels = "deepseek-chat" | "deepseek-reasoner";

class DeepSeekService {
  private selectedModel: DeepSeekModels;
  private openai: OpenAI;

  constructor(model: DeepSeekModels, url: string, apiKey: string) {
    this.selectedModel = model;
    this.openai = new OpenAI({
      baseURL: url,
      apiKey: apiKey,
    });
  }

  async chat_completions(systemMessage: string, userMessage: string) {
    const response = await this.openai.chat.completions.create({
      model: this.selectedModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return response.choices[0].message.content;
  }
}

export default DeepSeekService;
