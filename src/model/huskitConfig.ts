class HuskitConfig {
  provider: "ollama" | "deepseek" | "openai";

  deepseek_model?: string;
  deepseek_api_key?: string;
  deepseek_api_url: string;
  deepseek_max_commit_message_length: number;

  openai_model?: string;
  openai_api_key?: string;
  openai_api_url?: string;
  openai_max_commit_message_length?: number;

  ollama_model?: string;
  ollama_api_key?: string;
  ollama_api_url?: string;
  ollama_max_commit_message_length?: number;

  constructor() {
    this.provider = "deepseek";

    this.deepseek_model = "deepseek-chat";
    this.deepseek_api_url = "https://api.deepseek.com";
    this.deepseek_max_commit_message_length = 200;

    this.ollama_model = "deepseek-r1:8b";
    this.ollama_api_url = "http://localhost:11434";
    this.ollama_max_commit_message_length = 200;
  }
}

export default HuskitConfig;
