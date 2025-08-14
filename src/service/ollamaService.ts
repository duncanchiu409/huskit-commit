import ollama from "ollama";
import { generate_commit_message_prompt } from "../prompt";

class OllamaService {
  private selectedModel: string;

  constructor(model: string) {
    this.selectedModel = model;
  }

  async chat(commitMessage: string, diff: string) {
    const response = await ollama.chat({
      model: this.selectedModel,
      messages: [
        {
          role: "user",
          content: generate_commit_message_prompt(commitMessage, diff),
        },
      ],
      think: false,
    });

    return response.message.content;
  }
}

export default OllamaService;
