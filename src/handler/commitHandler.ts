import { generate_system_prompt, generate_user_prompt } from "../prompt";
import DeepseekService, { DeepSeekModels } from "../service/deepseekService";
import { LoggerHelperV2, LogLevel } from "../logger";
import ConfigService from "../service/configService";
import GitService from "../service/gitService";
import Error from "../error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function commitHandler() {
  const logger = new LoggerHelperV2();
  const config = ConfigService.read_config_file();
  const gitDiff = await GitService.get_staged_diff();
  const commitMessage = await GitService.get_commit_message();

  if (!config.provider) {
    logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
    return;
  }

  switch (config.provider) {
    // case 'ollama': {
    //   if (!config.ollama_model) {
    //     logger.log(LogLevel.ERROR, '', new Error.ModelNotSetError('ollama'));
    //     return;
    //   }
    //   const ollamaService = new OllamaService(config.ollama_model);
    //   const availableModels = await ollamaService.get_available_models();
    //   return;
    //   const systemPrompt = generate_system_prompt();
    //   const userPrompt = generate_user_prompt(gitDiff, commitMessage);
    //   const response = await ollamaService.chat_completions(
    //     systemPrompt,
    //     userPrompt
    //   );
    //   logger.log(LogLevel.INFO, response);
    //   break;
    // }
    case "deepseek": {
      if (!config.deepseek_model) {
        logger.log(LogLevel.ERROR, "", new Error.ModelNotSetError("deepseek"));
        return;
      }
      if (!config.deepseek_api_url) {
        logger.log(LogLevel.ERROR, "", new Error.ApiUrlNotSetError("deepseek"));
        return;
      }
      if (!config.deepseek_api_key) {
        logger.log(LogLevel.ERROR, "", new Error.ApiKeyNotSetError("deepseek"));
        return;
      }
      const deepseekService = new DeepseekService(
        config.deepseek_model as DeepSeekModels,
        config.deepseek_api_url,
        config.deepseek_api_key,
      );
      const systemPrompt = generate_system_prompt();
      const userPrompt = generate_user_prompt(gitDiff, commitMessage);
      const response = await deepseekService.chat_completions(
        systemPrompt,
        userPrompt,
      );
      logger.log(LogLevel.INFO, response ?? "");
      break;
    }
    default:
      logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
      break;
  }
}

export { commitHandler };
