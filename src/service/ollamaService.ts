import ollama from "ollama";

class OllamaService {
  private selectedModel: string;

  constructor(model: string) {
    this.selectedModel = model;
  }

  async get_available_models() {
    const response = await ollama.list();
    return response.models.map((model) => model.model);
  }

  async chat_completions(systemMessage: string, userMessage: string) {
    const response = await ollama.chat({
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
      think: false,
    });

    return response.message.content;
  }
}

export default OllamaService;
