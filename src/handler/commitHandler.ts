import { generate_system_prompt, generate_user_prompt } from "../prompt";
import DeepseekService, { DeepSeekModels } from "../service/deepseekService";
import { LoggerHelperV2, LogLevel } from "../logger";
import ConfigService from "../service/configService";
import GitService from "../service/gitService";
import OllamaService from "../service/ollamaService";
import Error from "../error";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function commitHandler(args: any) {
  const startTime = Date.now();
  const logger = new LoggerHelperV2();
  try {
    const config = ConfigService.read_config_file();
    const gitDiff = await GitService.get_staged_diff();
    let commitMessage = await GitService.get_commit_message();

    if (args.message) {
      logger.log(
        LogLevel.INFO,
        `🚀 Using the provided commit message: ${chalk.yellow(args.message)}`,
      );
      commitMessage = args.message;
      GitService.write_commit_message(commitMessage);
    } else {
      logger.log(
        LogLevel.WARN,
        `🚀 You didn't provide a commit message, using the current commit message: ${chalk.yellow(commitMessage)}`,
      );
    }

    if (!config.provider) {
      logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
      return;
    }

    switch (config.provider) {
      case "ollama": {
        if (!config.ollama_model) {
          logger.log(LogLevel.ERROR, "", new Error.ModelNotSetError("ollama"));
          return;
        }
        const ollamaService = new OllamaService(config.ollama_model);

        // check if the model is available
        const availableModels = await ollamaService.get_available_models();
        logger.log(
          LogLevel.INFO,
          `🚀 Selected model: ${chalk.green(config.ollama_model)}`,
        );
        if (!availableModels.includes(config.ollama_model)) {
          logger.log(
            LogLevel.ERROR,
            "",
            new Error.ModelNotAvailableError(`ollama ${config.ollama_model}`),
          );
          return;
        }

        const systemPrompt = generate_system_prompt(
          config.ollama_max_commit_message_length ?? 200,
        );
        const userPrompt = generate_user_prompt(gitDiff, commitMessage);
        const response = await ollamaService.chat_completions(
          systemPrompt,
          userPrompt,
        );

        const newCommitMessage = response ?? "";
        logger.log(
          LogLevel.INFO,
          `🚀 Commit message: ${chalk.yellow(newCommitMessage)}`,
        );
        GitService.write_commit_message(newCommitMessage);
        break;
      }
      case "deepseek": {
        if (!config.deepseek_model) {
          logger.log(
            LogLevel.ERROR,
            "",
            new Error.ModelNotSetError("deepseek"),
          );
          return;
        }
        if (!config.deepseek_api_url) {
          logger.log(
            LogLevel.ERROR,
            "",
            new Error.ApiUrlNotSetError("deepseek"),
          );
          return;
        }
        if (!config.deepseek_api_key) {
          logger.log(
            LogLevel.ERROR,
            "",
            new Error.ApiKeyNotSetError("deepseek"),
          );
          return;
        }
        const deepseekService = new DeepseekService(
          config.deepseek_model as DeepSeekModels,
          config.deepseek_api_url,
          config.deepseek_api_key,
        );
        const systemPrompt = generate_system_prompt(
          config.deepseek_max_commit_message_length ?? 200,
        );
        const userPrompt = generate_user_prompt(gitDiff, commitMessage);
        const response = await deepseekService.chat_completions(
          systemPrompt,
          userPrompt,
        );

        const newCommitMessage = response ?? "";
        logger.log(
          LogLevel.INFO,
          `🚀 Commit message: ${chalk.yellow(newCommitMessage)}`,
        );
        GitService.write_commit_message(newCommitMessage);
        break;
      }
      default:
        // should not reach here
        logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
        break;
    }
  } finally {
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    logger.log(LogLevel.INFO, `Execution time: ${executionTime}s`);
  }
}

export { commitHandler };
